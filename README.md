# mcp-art

Art MCP — Metropolitan Museum of Art Collection API (free, no auth)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_departments` | Get the list of all departments in the Metropolitan Museum of Art. |

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

Or use the CLI:

```bash
npx pipeworx use art
```

## License

MIT
