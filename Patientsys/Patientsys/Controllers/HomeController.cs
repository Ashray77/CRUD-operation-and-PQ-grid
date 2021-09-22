using Patientsys.DB;
using Patientsys.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Patientsys.Controllers
{
    public class HomeController : Controller
    {
        DBCon conn = new DBCon();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpPost]
        public ActionResult InsertData(PatientInfo data)
        {
            string message;
            conn.SaveData(data, out message);
            return Json(new JsonResult { Data = message });
            //return Json(data);
        }

        [HttpPost]
        public ActionResult GetAllData()
        {
            List<PatientInfo> patientInfos = conn.GetData();

            return Json(new JsonResult { Data = patientInfos, JsonRequestBehavior = JsonRequestBehavior.DenyGet });

        }

        [HttpPost]
        public ActionResult DeleteData(int? Id)
        {
            string message;
            conn.Delete(Id, out message);
            return Json(new JsonResult { Data = message });
        }

        [HttpPost]
        public ActionResult FetchDetails(int? Id)
        {
            PatientInfo SelectedData = conn.SelectedData(Id);
            return Json(new JsonResult { Data = SelectedData, JsonRequestBehavior = JsonRequestBehavior.DenyGet });
           
        }

        [HttpGet]
        public JsonResult AllDataList(int pq_rpp, int pq_curpage)
        {
            FinalResult response = new FinalResult();

            try
            {
                PQModel requestData = new PQModel
                {
                    RowPerPage = pq_rpp,
                    CurrentPage = pq_curpage
                };

                PQResult<PqFinalResult> finalData = conn.GetAllData(requestData);

                //  SearchCollectorAreaGraceResult<CollectorAreaGraceMasterData> searchResult = bl.GetList(requestData, 0); // 0 for Unapproved

                response.Data = finalData.Records;
                return Json(new { Success = true, response.Data, CurrentPage = pq_curpage, TotalRecords = finalData.TotalCount }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetSearchData(string searchname)
        {
            List<PatientInfo> patientInfos = conn.SearchData(searchname);

            return Json(new JsonResult { Data = patientInfos, JsonRequestBehavior = JsonRequestBehavior.DenyGet });
        }
    }
}