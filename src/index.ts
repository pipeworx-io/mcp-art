interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Art MCP — Metropolitan Museum of Art Collection API (free, no auth)
 *
 * Tools:
 * - search_artworks: search the collection and return details for the first 5 results
 * - get_artwork: full details for a single artwork by object ID
 * - get_departments: list all museum departments
 */


const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_artworks',
    description:
      'Search the Metropolitan Museum of Art collection by keyword. Returns details for up to 5 matching artworks including title, artist, date, medium, and image URL.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (e.g., "sunflowers", "ancient egypt", "monet")' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_artwork',
    description:
      'Get full details for a Metropolitan Museum artwork by its object ID, including title, artist, date, medium, department, and image URL.',
    inputSchema: {
      type: 'object',
      properties: {
        object_id: { type: 'number', description: 'Met Museum object ID (e.g., 436535)' },
      },
      required: ['object_id'],
    },
  },
  {
    name: 'get_departments',
    description: 'Get the list of all departments in the Metropolitan Museum of Art.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

interface RawArtwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  artistNationality: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  department: string;
  classification: string;
  primaryImage: string;
  primaryImageSmall: string;
  objectURL: string;
  isPublicDomain: boolean;
  creditLine: string;
  repository: string;
}

function formatArtwork(raw: RawArtwork) {
  return {
    object_id: raw.objectID,
    title: raw.title,
    artist: raw.artistDisplayName || 'Unknown',
    artist_nationality: raw.artistNationality || '',
    date: raw.objectDate,
    medium: raw.medium,
    dimensions: raw.dimensions,
    department: raw.department,
    classification: raw.classification,
    image_url: raw.primaryImageSmall || raw.primaryImage || '',
    full_image_url: raw.primaryImage || '',
    is_public_domain: raw.isPublicDomain,
    credit_line: raw.creditLine,
    met_url: raw.objectURL,
  };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_artworks': {
      const query = args.query as string;
      const searchRes = await fetch(
        `${BASE_URL}/search?q=${encodeURIComponent(query)}&hasImages=true`,
      );
      if (!searchRes.ok) throw new Error(`Met Museum search error: ${searchRes.status}`);
      const searchData = (await searchRes.json()) as {
        total: number;
        objectIDs: number[] | null;
      };
      if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
        return { query, total: 0, artworks: [] };
      }
      // Fetch details for first 5 results in parallel
      const first5 = searchData.objectIDs.slice(0, 5);
      const detailResults = await Promise.all(
        first5.map(async (id) => {
          const res = await fetch(`${BASE_URL}/objects/${id}`);
          if (!res.ok) return null;
          return (await res.json()) as RawArtwork;
        }),
      );
      const artworks = detailResults
        .filter((r): r is RawArtwork => r !== null)
        .map(formatArtwork);
      return {
        query,
        total: searchData.total,
        showing: artworks.length,
        artworks,
      };
    }

    case 'get_artwork': {
      const objectId = args.object_id as number;
      const res = await fetch(`${BASE_URL}/objects/${objectId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error(`Artwork not found: ${objectId}`);
        throw new Error(`Met Museum error: ${res.status}`);
      }
      const data = (await res.json()) as RawArtwork;
      return formatArtwork(data);
    }

    case 'get_departments': {
      const res = await fetch(`${BASE_URL}/departments`);
      if (!res.ok) throw new Error(`Met Museum error: ${res.status}`);
      const data = (await res.json()) as {
        departments: { departmentId: number; displayName: string }[];
      };
      return {
        count: data.departments.length,
        departments: data.departments.map((d) => ({
          id: d.departmentId,
          name: d.displayName,
        })),
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
