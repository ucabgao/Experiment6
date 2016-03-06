using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using Microsoft.AspNet.SignalR;

[assembly: OwinStartup(typeof(webbage.chat.web.startup.StartUp))]

namespace webbage.chat.web.startup {
    public class StartUp {
        public void Configuration(IAppBuilder app) {
            var hubConfig = new HubConfiguration();
            hubConfig.EnableDetailedErrors = true;

            app.MapSignalR(hubConfig);
        }
    }
}
