using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;

namespace RightsDrive.Controllers
{
    public class CategoryController : Controller
    {   
        public ActionResult Category(string category)
        {
            string host = Request.Url.Host; //.Current.Request.Url.Host;
            string url = "";
            if (host.Contains("localhost"))
                url = "https://localhost:44347/api/rh/category/namecheck?CategoryName=" + category;
            else
                url = "https://api.dropcap.com/api/rh/category/namecheck?CategoryName=" + category;

            WebRequest request = WebRequest.Create(url);
            request.Method = "GET";
            try
            {
                WebResponse response = request.GetResponse();
            }
            catch
            {
                //return HttpNotFound("File Not Found");
                throw new HttpException(404, "File Not Found");
            }

            ViewData["CatName"] = category;
            return View();
        }
    }
}