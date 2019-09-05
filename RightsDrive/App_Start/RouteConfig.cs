using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace RightsRocket
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapMvcAttributeRoutes();

            routes.LowercaseUrls = true;
            
            routes.MapRoute(
               name: "BookPage",
               url: "book/{slug}",
               defaults: new { controller = "Book", action = "BookProfile" }
           );
            routes.MapRoute(
                name: "CategoryPage",
                url: "category/{category}",
                defaults: new { controller = "Category", action = "Category" }
            );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
