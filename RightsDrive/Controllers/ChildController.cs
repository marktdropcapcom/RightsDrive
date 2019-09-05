using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RightsRocket.Controllers
{
    public class ChildController : Controller
    {
        [ChildActionOnly]
        public ViewResult SideBar()
        {
            return View();
        }

    }
}