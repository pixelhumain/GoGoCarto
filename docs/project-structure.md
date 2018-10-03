Project Structure
=================

The project is currently organized in two bundles :

- CoreBundle : home page, basic back office (configure credits, home page info etc...)
- GeoDirectoryBundle : The Directory itself, including the client side and back office app. We're planning to make this bundle reusable, so be sure to put all things directly linked to the directory in this bundle.

In each bundle :

- Javascript/TypeScript sources `Resources/js`
- SCSS sources `Resources/scss`
- Javascript compiled folder `web/js`
- CSS compiled folder `web/assets/css`



