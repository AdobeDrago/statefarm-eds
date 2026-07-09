# statefarm-eds

AEM Edge Delivery Services (EDS) migration of the State Farm insurance hub
page, authored in Adobe Document Authoring (DA).

- **Source**: https://www.statefarm.com/insurance
- **Live preview**: https://main--statefarm-eds--adobedrago.aem.live/insurance
- **Content authoring**: https://da.live/#/adobedrago/statefarm-eds

## Structure

- `blocks/` — EDS block implementations (CSS + JS), one folder per block
- `styles/` — global styles, brand tokens, fonts
- `scripts/` — EDS boilerplate (block loading, lazy loading, delayed scripts)
- `tools/importer/` — import tooling used to bootstrap block parsers from the
  source site (`parsers/`, `transformers/`, `page-templates.json`)

## Local development

```
npm install
npm run lint
```

Content is authored in DA and mounted as the project's content source
(see `fstab.yaml`). Code changes (blocks, styles, scripts) are made in this
repo and deployed via the `main` branch.
