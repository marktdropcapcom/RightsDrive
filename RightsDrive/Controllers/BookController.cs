using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RightsDrive.Controllers
{
    public class BookController : Controller
    {
        
        public ActionResult BookProfile(string slug)
        {
            ViewData["Slug"] = slug;

            return View();
        }

    }
}