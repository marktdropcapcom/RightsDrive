using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RightsDrive.Controllers
{
    public class CategoryController : Controller
    {
        
        public ActionResult Category(string category)
        {
            ViewData["CatName"] = category;

            return View();
        }

    }
}