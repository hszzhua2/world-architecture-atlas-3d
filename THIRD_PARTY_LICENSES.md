# Third-Party Licenses

This project incorporates work from the following projects.

---

## MIT License

The following components are licensed under the MIT License:

### GeoLibre
- **Version:** 2.3.0
- **Copyright:** (c) 2026 Qiusheng Wu
- **Source:** https://github.com/opengeos/GeoLibre
- **License:** MIT
- **Usage:** Base GIS platform. This project is a fork of GeoLibre with additional 3D landmark rendering capabilities.

### Three.js
- **Version:** 0.178.0
- **Copyright:** (c) 2010-2024 three.js authors
- **Source:** https://threejs.org/
- **License:** MIT
- **Usage:** 3D rendering engine for landmark models. Used for GLB model loading (GLTFLoader), scene management, and WebGL rendering via a custom MapLibre layer.

### React
- **Version:** 19.2.7
- **Copyright:** (c) Meta Platforms, Inc. and affiliates
- **Source:** https://react.dev/
- **License:** MIT
- **Usage:** UI framework for the desktop application shell.

### Vite
- **Version:** 8.1.5
- **Copyright:** (c) 2019-present, Yuxi (Evan) You and Vite contributors
- **Source:** https://vitejs.dev/
- **License:** MIT
- **Usage:** Development server and build tool.

### Zustand
- **Version:** 5.0.14
- **Copyright:** (c) 2019 Paul Henschel
- **Source:** https://github.com/pmndrs/zustand
- **License:** MIT
- **Usage:** State management for the application store.

### i18next
- **Version:** 26.3.6
- **Copyright:** (c) 2024 i18next
- **Source:** https://www.i18next.com/
- **License:** MIT
- **Usage:** Internationalization framework.

### react-i18next
- **Version:** 17.0.10
- **Copyright:** (c) 2024 i18next
- **Source:** https://react.i18next.com/
- **License:** MIT
- **Usage:** React bindings for i18next.

### @turf/helpers
- **Version:** 7.3.5
- **Copyright:** (c) 2024 Turfjs
- **Source:** https://turfjs.org/
- **License:** MIT
- **Usage:** GeoJSON helper utilities.

### @deck.gl/core, @deck.gl/layers, @deck.gl/mesh-layers
- **Version:** 9.3.7
- **Copyright:** (c) 2015 - 2024, Vis.gl contributors
- **Source:** https://deck.gl/
- **License:** MIT
- **Usage:** WebGL-powered data visualization layers (part of GeoLibre's rendering stack).

---

## BSD 3-Clause License

The following components are licensed under the BSD 3-Clause "New" or "Revised" License:

### MapLibre GL JS
- **Version:** 5.24.0
- **Copyright:** (c) 2017, Mapbox
- **Source:** https://maplibre.org/
- **License:** BSD-3-Clause
- **Usage:** Open-source map rendering engine. Powers the interactive 2D/3D map canvas. The custom Three.js landmark layer integrates with MapLibre's custom layer API (`CustomLayerInterface`) and shares its WebGL context.

> MapLibre GL JS was forked from Mapbox GL JS v1.13.0. The BSD-3-Clause license requires the following notice:
>
> Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
> 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
> 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
> 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

---

## ISC License

The following components are licensed under the ISC License:

### Lucide React
- **Version:** 1.25.0
- **Copyright:** (c) 2020, Lucide Contributors
- **Source:** https://lucide.dev/
- **License:** ISC
- **Usage:** SVG icon library. The Landmark icon (`Landmark` from lucide-react) is used as the toolbar button icon for the 3D landmarks feature.

> Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

---

## Public Domain

The following data resources are in the public domain:

### Natural Earth
- **Version:** v5.2.0
- **Source:** https://www.naturalearthdata.com/
- **License:** Public Domain (No Rights Reserved)
- **Usage:** Vector datasets used for geographic context, including:
  - `ne_110m_populated_places_simple.geojson`
  - `ne_10m_airports.geojson`
  - `ne_10m_urban_areas.geojson`
  - `ne_10m_ports.geojson`
  - `ne_10m_parks_and_protected_lands_area.geojson`
  - `ne_10m_parks_and_protected_lands_point.geojson`
  - `ne_50m_populated_places_simple.geojson`
  - `ne_50m_urban_areas.geojson`
- **Source repository:** https://github.com/nvkelso/natural-earth-vector

### OpenFreeMap
- **Source:** https://openfreemap.org/
- **License:** OpenFreeMap data is based on OpenStreetMap (ODbL) and rendered styles are MIT/CC0.
- **Usage:** Default base map tiles.

---

## OpenStreetMap Data

Map data and base map tiles may be derived from OpenStreetMap contributors, licensed under the [Open Data Commons Open Database License (ODbL)](https://www.openstreetmap.org/copyright).

---

## Full License Texts

For the complete text of each license:

- [MIT License](https://opensource.org/licenses/MIT)
- [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause)
- [ISC License](https://opensource.org/licenses/ISC)
- [ODbL License](https://www.opendatacommons.org/licenses/odbl/)
