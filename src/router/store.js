// for data share
const store = {
    host: '',
    authToken: '',
    hosts: [
        {name: 'Local', url: 'http://localhost:8081/', authToken: ''},
        {name: 'Local 2', url: 'http://localhost:8080/', authToken: ''},
    ]
};
store.host = store.hosts[1].url;
const saveHost = localStorage.getItem('selectedHost');
if (saveHost != null && saveHost.length > 1) {
    store.host = saveHost;
}
export {store}
