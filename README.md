# mcp-art

Art MCP — Metropolitan Museum of Art Collection API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_artworks` | Search the Met's collection by subject, artist or keyword (e.g., "sunflowers", "monet", "ancient egypt"). Artworks whose TITLE matches come first, then ones whose ARTIST or culture matches, then general full-text matches; each result says which via `matched_on`. Returns title, artist, date, medium and image URL. |
| `get_artwork` | Get full details for a specific artwork. Provide the object ID from search results. Returns title, artist, date, medium, department, and high-resolution image URL. |
| `get_departments` | Return the full list of Metropolitan Museum of Art curatorial departments (e.g., 'Egyptian Art', 'Modern and Contemporary Art'), each with its numeric department ID. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "art": {
      "url": "https://gateway.pipeworx.io/art/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Art data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
