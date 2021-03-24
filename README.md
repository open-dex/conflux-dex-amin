# conflux-dex-admin
Conflux dex admin UI is for Conflux open dex. It provides UI to monitor and operate the dex backend.
After deploying and starting the dex backend, developer could setup this frontend to try the basic operations
like deposit, placing order, withdraw.
 
It's based on Vue And Element-ui.
## Pre-requirement
- A running conflux open dex backend.
- Conflux portal, browser plugin that supports google chrome, Microsoft Edge, Firefox.
[Dev document](https://developer.conflux-chain.org/docs/conflux-portal/docs/en/portal/introduction),
[Conflux portal (wallet)](https://portal.conflux-chain.org/).
- The UI_ADMIN private key which is configured in the backend during deploying. Import it into Conflux portal.
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
You can change server port in file vue.config.js.
### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### How to
#### Setup the backend url
After starting it, open a browser(chrome is recommend), point to http://localhost:9527 (9527 is the default port),
you should see the welcome page.

At the top left of the page, besides 'Current host' is a dropdown list, click the pencil icon besides it to open
a [Hosts dialog], we could add or remove host entries here, modify is not supported for now. A host URL is like
 http://1.2.3.4:9527/ . After closing this
dialog we need to select the host in the dropdown list(switch host). 
#### Trade
At the left menu, click `OpenDex`, open the trading page. If UI_ADMIN is the same as BOOM_ADMIN, then it has some
tokens minted during deploying backend, otherwise, see the `mint` section in the `deploy.md` in the backend.
### Vue Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
