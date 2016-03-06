using System.Web.Optimization;

namespace webbage.chat.web {
    public class BundleConfig {
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/scripts/third-party")
                .IncludeDirectory("~/content/scripts", "*.js", true)
                .IncludeDirectory("~/content/bower/jquery/dist", "*.js", true)
                .IncludeDirectory("~/content/bower/angular", "*.js", true)
                .IncludeDirectory("~/content/bower/angular-animate", "*.js", true)
                .IncludeDirectory("~/content/bower/angular-cookies", "*.js", true)
                .IncludeDirectory("~/content/bower/angular-route", "*.js", true)
                .IncludeDirectory("~/content/bower/auth0-lock/build", "*.js", true)
                .IncludeDirectory("~/content/bower/auth0-storage/dist", "*.js", true)
                .IncludeDirectory("~/content/bower/angular-jwt/dist", "*.js", true)
                .IncludeDirectory("~/content/bower/auth0-angular/build", "*.js", true)
                .IncludeDirectory("~/content/bower/angular-ui/build", "*.js", true)
                .IncludeDirectory("~/content/bower/angular-hotkeys/build", "*.js", true)
                .IncludeDirectory("~/content/bower/bootstrap/dist/js", "*.js", true)
                .IncludeDirectory("~/content/bower/signalR", "*.js", true));

            bundles.Add(new ScriptBundle("~/scripts/app")
                .IncludeDirectory("~/app/shared/services", "*.js", true)
                .IncludeDirectory("~/app/shared/directives", "*.js", true)
                .IncludeDirectory("~/app/components/rooms", "*.js", true)
                .IncludeDirectory("~/app/components/default", "*.js", true));

            bundles.Add(new StyleBundle("~/styles/site")
                .IncludeDirectory("~/content/bower/bootstrap/dist/css", "*.css", true)
                .IncludeDirectory("~/content/bower/fontawesome/css", "*.css", true)
                .IncludeDirectory("~/content/css", "*.css", true));
        }
    }
}