# Fuel Wise

Find nearby fuel stations and compare the estimated cost of buying 40 L of Pb95 plus driving to each station. Built with Next.js, React, MapLibre and [Geoapify](https://www.geoapify.com/).

**All fuel prices are synthetic sample data, not current or verified station prices.** Locations and driving routes come from Geoapify. Sample prices are assigned deterministically by station ID from matching brand samples, preferring the station's country. Unknown brands can have no price.

## Setup

1. Install Node.js 22.18 or later and npm (tests use Node's TypeScript support).
2. Clone this repository and open a terminal in its root directory.
3. Install locked dependencies:

   ```sh
   npm ci
   ```

4. Create a project and API key in [Geoapify MyProjects](https://myprojects.geoapify.com/).
5. Copy `.env.example` to `.env.local` in the repository root. Replace the placeholders with your keys. Configure the browser key to allow your development and deployment origins. Keep the server key private.

   | Variable | Purpose |
   | --- | --- |
   | `GEOAPIFY_API_KEY` | Server-side geocoding, Places and Routing requests. |
   | `NEXT_PUBLIC_MAP_STYLE_BRIGHT` | Full MapLibre-compatible light style URL, including a browser API key. |
   | `NEXT_PUBLIC_MAP_STYLE_DARK` | Full dark style URL, including a browser API key. |

   `NEXT_PUBLIC_*` values are visible in the browser and embedded during builds. Restart development after editing environment variables; rebuild production after changing public values. Do not commit `.env.local` or private keys.

6. Start development:

   ```sh
   npm run dev
   ```

7. Open [localhost:3000](http://localhost:3000). Search for a city, then an address, enter coordinates, select a map point, or use your current location. Adjust the radius and result limit. Set consumption and press **Apply** to recalculate the ranking.

For production:

```sh
npm run build
npm start
```

Network access is required for Geoapify. Production builds also download Google Fonts through `next/font/google`.

## Cost model

The ranking uses Pb95, a fixed purchase of **40 L**, and **one-way driving distance** from Geoapify Routing. Consumption defaults to 7 L/100 km and accepts 0.1 to 100 in steps of 0.1.

```text
fuel cost = 40 L × sample price (EUR/L)
driving cost = distance (km) × consumption (L/100 km) / 100 × sample price (EUR/L)
total cost = fuel cost + driving cost
```

Fuel consumed on the trip is valued at the destination station's sample price. Results sort by unrounded total cost; equal totals prefer the shorter drive. Amounts display in EUR rounded to two decimal places. Missing routes or Pb95 prices prevent an estimate: these stations appear last without a rank. Changing consumption reuses fetched routes.

## Architecture

- `src/modules/search`: location selection and station search through Geoapify Geocoding and Places (`service.vehicle.fuel`).
- `src/modules/prices`: synthetic fixtures and deterministic assignment to real station locations.
- `src/lib/api/getRoute.ts`: server-side Geoapify Routing in driving mode.
- `src/modules/ranking`: cached routes, client-side cost calculation, sorting and presentation.
- `src/modules/map`: MapLibre map, routes and shared station/consumption state.
- `src/modules/lang`: English, German, Spanish, French and Italian UI text.

Requests requiring the server key run on the server. The browser loads map styles and tiles directly. This app uses Geoapify REST APIs; runtime MCP integration is not required.

## Validation

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Automated tests cover a cheaper but more distant station losing on total cost, a changed winner after changing consumption, missing/invalid data and tie-breaking.

Manual checklist with configured keys:

- Search for a location and verify stations and sample-price notices appear.
- Compare the displayed total with fuel plus driving costs; apply a different consumption and check updated totals.
- Try empty, zero and negative consumption: the form must reject them.
- Select a ranked station and verify its route on the map.
- Check missing-price/route messages, pagination, narrow screens, both themes and all five languages.

## Limitations

- This is a demonstration, not a source of live prices or real-world savings estimates.
- Only up to 20 nearby Places results within the selected radius are compared; the winner is not guaranteed to be the cheapest station in the entire area.
- Costs exclude return travel, traffic-dependent consumption, time value, tolls and vehicle wear.
- Purchase volume and fuel type are fixed for this MVP. Consumption persists during client navigation but resets on full reload.
- API availability, quotas and missing source data can limit results. Browser geolocation requires permission and a secure context (HTTPS or localhost).

## License

MIT — see [LICENSE](LICENSE). Geoapify services and underlying map data remain subject to their respective terms and attribution requirements.
