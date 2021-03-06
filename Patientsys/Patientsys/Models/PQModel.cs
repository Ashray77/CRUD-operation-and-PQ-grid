using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Patientsys.Models
{
    public class PQModel
    {
        public int RowPerPage { get; set; }
        public int CurrentPage { get; set; }
    }
    public class PQResult<T>
    {
        public T Records { get; set; }
        public int TotalCount { get; set; }
    }
    public class PqFinalResult
    {
        public List<PatientInfo> AllData;
    }
    public class FinalResult
    {
        public dynamic Data { get; set; }
    }
}