using System.Web;
using System.Web.Optimization;

namespace SUREF
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/jquery-1.11.3.min.js",
                      "~/Scripts/star-rating.min.js",
                      "~/Scripts/bootstrap-toggle.min.js"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                      "~/Scripts/moment.min.js"));
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/leaflet.css",
                      "~/Content/leaflet.label.css",
                      "~/Content/MarkerCluster.css",
                      "~/Content/MarkerCluster.Default.css",
                      "~/Content/font-awesome.min.css",
                      "~/Content/loading-bar.css",
                      "~/Content/leaflet.extra-markers.min.css",
                      "~/Content/ng-table.css",
                      "~/Content/star-rating.min.css",
                      "~/Content/bootstrap-toggle.min.css"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/Scripts/angular.js",
                       "~/Scripts/loading-bar.js",
                      "~/Scripts/angular-route.js",
                      "~/Scripts/angular-resource.js",
                       "~/Scripts/ui-bootstrap-tpls.js",
                      "~/Scripts/app/app.js",
                      "~/Scripts/app/services.js",
                      "~/Scripts/app/flight.js",
                      "~/Scripts/app/coverageMap.js",
                      "~/Scripts/app/summary.js",
                      "~/Scripts/app/diag.js",
                      "~/Scripts/app/summaryDetails.js",
                      "~/Scripts/app/search.js",
                      "~/Scripts/ng-table.js"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/leaflet").Include(
                      "~/Scripts/leaflet.js",
                      "~/Scripts/app/mapFix.js",
                      "~/Scripts/leaflet.label.js",
                     "~/Scripts/leaflet.markercluster.js",
                      "~/Scripts/leaflet.polylineDecorator.js",
                      "~/Scripts/angular-leaflet-directive.min.js",
                      "~/Scripts/leaflet.extra-markers.min.js"
                      
                      ));
            bundles.Add(new ScriptBundle("~/bundles/highcharts").Include(
                      //"~/Scripts/highcharts.js",
                      "~/Scripts/highcharts.src.js",
                      "~/Scripts/app/chart.js",
                      "~/Scripts/app/getChart.js",
                      "~/Scripts/highcharts-ng.js"
                      ));
        }
    }
}
