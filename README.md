# @pipeworx/mcp-art

MCP server for art data from public museum APIs. Powered by the [Metropolitan Museum of Art Collection API](https://metmuseum.github.io/) (free, no auth required).

## Tools

| Tool | Description |
|------|-------------|
| `search_artworks` | Search the Met collection by keyword (returns up to 5 results with details) |
| `get_artwork` | Get full details for an artwork by object ID |
| `get_departments` | List all museum departments |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "art": {
      "url": "https://gateway.pipeworx.io/art/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use art
```

## License

MIT
