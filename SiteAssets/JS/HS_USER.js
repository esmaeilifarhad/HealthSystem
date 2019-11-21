var foreignKey = 0;
var CurrentCID = 0;
var CurrentPID = 0;
var xxx = 0;
var yyy = "";
var dore = 0;
/*
List Name :
GIG_HS_AzmayeshMaster
GIG_HS_AzmayeshDetail
GIG_HS_RefrenceRange  
GIG_HS_AzmayeshName 
GIG_HS_AzmayeshCategory
GIG_HS_AzmayeshPeriod
GIG_HS_GenLookup

GIG_HS_DrugAllergy 
GIG_HS_FoodAllergy
GIG_HS_AllergyLookup
GIG_HS_Bimari
*/
$(document).ready(function () {
    //-----npm initial header Request
    $pnp.setup({
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    });
    CurrentCID = sessionStorage.getItem("CID");
    CurrentPID = sessionStorage.getItem("PID");

    showAzmayeshPeriod();

});
//---------------------------------------
function getval(sel) {
    dore = sel.value;
    ShowAzmayeshMaster();
}
//-------------------------------------------------------
async function showAzmayeshPeriod() {
    var AzmayeshPeriod = await GetAzmayeshPeriod()
    var selectOption = "<select onchange='getval(this)'>"
    for (let index = 0; index < AzmayeshPeriod.length; index++) {
        selectOption += "<option value=" + AzmayeshPeriod[index].Id + ">" + AzmayeshPeriod[index].Title + "</option>"
    }
    selectOption += "</select>"
    $("#dore").append(selectOption)
    dore = $("#dore select").val()
    ShowAzmayeshMaster();
}
async function ShowAzmayeshMaster() {
    $("#NameUser").next().remove();
    $("#PID").next().remove();
    $("#Weight").next().remove();
    $("#Height").next().remove();
    $("#Company").next().remove();
    $("#Blood").next().remove();
    $("#Age").next().remove();
    $("#Department").next().remove();
    $("#SpecialDiseases").next().remove();
    $("#FoodAllergy").next().remove();
    $("#DrugAllergy").next().remove();
    $("#Calorie").next().remove();
    $("#Semat").next().remove();
    $("#IdAzmayesh").next().remove();

    var AzmayeshMaster = await GetAzmayeshMaster();
    showAzmayeshDetail(AzmayeshMaster);
    showImage(AzmayeshMaster)
    showFoodAllergy(AzmayeshMaster)
    showDrugAllergy(AzmayeshMaster)
    showBimari(AzmayeshMaster)

    debugger
    $("#IdAzmayesh").after("<span>" + AzmayeshMaster[0].Id + "</span>");
    $("#NameUser").after("<span>" + AzmayeshMaster[0].FirstName + "  " + AzmayeshMaster[0].LastName + "</span>");
    $("#PID").after("<span>" + AzmayeshMaster[0].PID + "</span>");
    $("#Weight").after("<span>" + AzmayeshMaster[0].Weight + "</span>");
    $("#Height").after("<span>" + AzmayeshMaster[0].Height + "</span>");
    $("#Company").after("<span>" + splitString(AzmayeshMaster[0].Company)[1] + "</span>");
    $("#Blood").after("<span>" + AzmayeshMaster[0].Blood + "</span>");
    $("#Age").after("<span>" + AzmayeshMaster[0].Age + "</span>");
    $("#Calorie").after("<span>" + AzmayeshMaster[0].Calorie + "</span>");
    $("#Semat").after("<span>" + AzmayeshMaster[0].Semat + "</span>");
    $("#Department").after("<span>" + AzmayeshMaster[0].Department + "</span>");
    $("#SpecialDiseases").after((AzmayeshMaster[0].SpecialDiseases)==true?"<span style='color:red'>بله</span>":"<span>خیر</span>");
    $("#FoodAllergy").after((AzmayeshMaster[0].FoodAllergy)==true?"<span style='color:red'>بله</span>":"<span>خیر</span>");
    $("#DrugAllergy").after((AzmayeshMaster[0].DrugAllergy)==true?"<span style='color:red'>بله</span>":"<span>خیر</span>");
}
async function showAzmayeshDetail(AzmayeshMaster) {
    $("#tableres table").remove()

    var AzmayeshName = await GetAzmayeshName();
    var AzmayeshDetail = await GetAzmayeshDetail(AzmayeshMaster);
    showRefrenceRange(AzmayeshMaster, AzmayeshDetail);



    function checkAdult(age) {
        //console.log(age)
        if (age.ID == xxx) {
            yyy = age.Category.Title;
        }
    }

    var table = "<table class='tblH table'>"
    table += "<tr>"
    table += "<th>عنوان</th><th>نام</th><th>گروه</th><th>توضیحات</th><th>نتیجه</th>"
    table += "</tr>"
    for (var i = 0; i < AzmayeshDetail.length; i++) {
        xxx = AzmayeshDetail[i].Azmayesh.Id
        AzmayeshName.find(checkAdult)
        table += "<tr>"
        table += "<td>"
        table += AzmayeshDetail[i].Azmayesh.Code
        table += "</td>"
        table += "<td>"
        table += AzmayeshDetail[i].Azmayesh.Title
        table += "</td>"
        table += "<td>"
        table += yyy
        table += "</td>"
        table += "<td>"
        table += AzmayeshDetail[i].Azmayesh.Description
        table += "</td>"
        table += "<td>"
        table += AzmayeshDetail[i].Result
        table += "</td>"
        table += "</tr>"
    }
    table += "</table>"
    $("#tableres").append(table);
}
async function showRefrenceRange(AzmayeshMaster, AzmayeshDetail) {
    // var RefrenceRange = await GetRefrenceRange(AzmayeshMaster, AzmayeshDetail);
    /*
     console.log(AzmayeshMaster)
     console.log(AzmayeshDetail)
     console.log(RefrenceRange)
     */
    $("#tableres2 table").remove()
    var table = "<table class='tblH table'>"
    table += "<tr>"
    table += "<th>عنوان</th><th>نام</th><th>Title</th><th>Description</th>"
    table += "</tr>"
    for (let i = 0; i < AzmayeshDetail.length; i++) {
        // console.log(AzmayeshDetail[i].Azmayesh.Title)
        var RefrenceRange = await GetRefrenceRange(AzmayeshMaster, AzmayeshDetail[i])
       // debugger
        //console.log(RefrenceRange)
        if (RefrenceRange == undefined)
            continue
        if (RefrenceRange.length > 0) {

            table += "<tr>"
            table += "<td>"
            table += RefrenceRange[0].Azmayesh.Code
            table += "</td>"
            table += "<td>"
            table += RefrenceRange[0].Azmayesh.Title
            table += "</td>"
  
            table += "<td>"
            table += RefrenceRange[0].Id
            table += "</td>"
            table += "<td>"
            table += RefrenceRange[0].Status.Title
            table += "</td>"
            table += "<tr>"

        }
    }
    table += "</table>"
    $("#tableres2").append(table);
}
async function showFoodAllergy(AzmayeshMaster)
{
   var FoodAllergy=await  GetFoodAllergy(AzmayeshMaster)
  // console.log(FoodAllergy)

   $("#tableres3 table").remove()
   var table = "<table class='tblH table'>"
   table += "<tr>"
   table += "<th>ردیف</th><th>عنوان</th>"
   table += "</tr>"
   for (let i = 0; i < FoodAllergy.length; i++) {

       if (FoodAllergy.length > 0) {

           table += "<tr>"
           table += "<td>"
           table += i+1
           table += "</td>"
           table += "<td>"
           table += FoodAllergy[i].FoodAllergy.Title
           table += "</td>"
           table += "<tr>"

       }
   }
   table += "</table>"
   $("#tableres3").append(table);

}
async function showDrugAllergy(AzmayeshMaster)
{
   var DrugAllergy=await  GetDrugAllergy(AzmayeshMaster)
   console.log(DrugAllergy)

   $("#tableres4 table").remove()
   var table = "<table class='tblH table'>"
   table += "<tr>"
   table += "<th>ردیف</th><th>عنوان</th>"
   table += "</tr>"
   for (let i = 0; i < DrugAllergy.length; i++) {

       if (DrugAllergy.length > 0) {

           table += "<tr>"
           table += "<td>"
           table += i+1
           table += "</td>"
           table += "<td>"
           table += DrugAllergy[i].DrugAllergy.Title
           table += "</td>"
           table += "<tr>"

       }
   }
   table += "</table>"
   $("#tableres4").append(table);

}
async function showBimari(AzmayeshMaster)
{
   var Bimari=await  GetBimari(AzmayeshMaster)
  // console.log(Bimari)

   $("#tableres5 table").remove()
   var table = "<table class='tblH table'>"
   table += "<tr>"
   table += "<th>ردیف</th><th>عنوان</th>"
   table += "</tr>"
   for (let i = 0; i < Bimari.length; i++) {

       if (Bimari.length > 0) {

           table += "<tr>"
           table += "<td>"
           table += i+1
           table += "</td>"
           table += "<td>"
           table += Bimari[i].Bimari.Title
           table += "</td>"
           table += "<tr>"

       }
   }
   table += "</table>"
   $("#tableres5").append(table);

}
function showImage(AzmayeshMaster) {
    debugger
    $("#imgFatLevel img").remove()
    $("#imgFatLevel p").remove()
    var BMI = AzmayeshMaster[0].BMI;
    var BMIMessage="No Matching";
    if(AzmayeshMaster[0].Gender=="مرد")
    {
        if (BMI > 0 && BMI <= 18.4) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m1-2.jpg' alt='Girl in a jacket' width='30' height='80'>");
            BMIMessage="کمبود وزن";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m1-1.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        if (BMI > 18.5 && BMI <= 24.9) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m2-2.jpg' alt='Girl in a jacket' width='30' height='80'>");
          //  console.log("نرمال");
           BMIMessage="نرمال";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m2-1.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        if (BMI > 25 && BMI <= 29.9) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m3-2.jpg' alt='Girl in a jacket' width='30' height='80'>");
           // console.log("اضافه وزن");
            BMIMessage="اضافه وزن";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m3-1.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        if (BMI > 30 && BMI <= 34.9) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m4-2.jpg' alt='Girl in a jacket' width='30' height='80'>");
           // console.log("اضافه وزن درجه 1");
            BMIMessage="اضافه وزن درجه 1";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m4-1.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        if (BMI > 35 && BMI <= 39.9) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m5-2.jpg' alt='Girl in a jacket' width='30' height='80'>");
            //console.log("اضافه وزن درجه 2");
            BMIMessage="اضافه وزن درجه 2";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/m5-1.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        $("#imgFatLevel").append("<p>"+BMIMessage+"</p>");
    }
    else
    {
         if (BMI > 0 && BMI <= 18.4) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/12.jpg' alt='Girl in a jacket' width='30' height='80'>");
            BMIMessage="کمبود وزن";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/11.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        if (BMI > 18.5 && BMI <= 24.9) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/22.jpg' alt='Girl in a jacket' width='30' height='80'>");
          //  console.log("نرمال");
           BMIMessage="نرمال";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/21.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        if (BMI > 25 && BMI <= 29.9) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/32.jpg' alt='Girl in a jacket' width='30' height='80'>");
           // console.log("اضافه وزن");
            BMIMessage="اضافه وزن";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/31.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        if (BMI > 30 && BMI <= 34.9) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/42.jpg' alt='Girl in a jacket' width='30' height='80'>");
           // console.log("اضافه وزن درجه 1");
            BMIMessage="اضافه وزن درجه 1";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/41.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        if (BMI > 35 && BMI <= 39.9) {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/52.jpg' alt='Girl in a jacket' width='30' height='80'>");
            //console.log("اضافه وزن درجه 2");
            BMIMessage="اضافه وزن درجه 2";
        }
        else
        {
            $("#imgFatLevel").append("<img src='https://portal.golrang.com/healthsystem/SiteAssets/img/51.jpg' alt='Girl in a jacket' width='30' height='80'>"); 
        }
        $("#imgFatLevel").append("<p>"+BMIMessage+"</p>");
    }
/*
var BMI = form.GetControl("c_BMI").GetValue();
if (BMI == 0 ) {
console.log("-");
}
else if ( BMI > 0 && BMI <= 18.4 ) {
console.log("کمبود وزن");
}
else if (BMI > 18.5 && BMI <= 24.9 ) {
console.log("نرمال");
}
else if (BMI > 25 && BMI <= 29.9 ) {
console.log("اضافه وزن");
}
else if (BMI > 30 && BMI <= 34.9 ) {
console.log("اضافه وزن درجه 1");
}
else if (BMI > 35 && BMI <= 39.9 ) {
console.log("اضافه وزن درجه 2");
}
else {
console.log("اضافه وزن درجه 3");
}
*/
}
//-------------------------------------------------------
function GetAzmayeshMaster() {
    debugger
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_AzmayeshMaster").
            items.select("AzmayeshPeriod/Title,AzmayeshPeriod/Id,Department,FirstName,LastName,BMI," +
                "PID,Weight,Height,Calorie,Semat,Blood,Age,SpecialDiseases,FoodAllergy,DrugAllergy,Company,Id,Title,Gender").
            filter("(CID eq " + CurrentCID + ") and (PID eq " + CurrentPID + ") and (AzmayeshPeriod/Id eq " + dore + ")").
            expand("AzmayeshPeriod").
            // orderBy("Modified", true).
            get().
            then(function (items) {
                debugger
                resolve(items);
            });

    });
}
function GetAzmayeshDetail(AzmayeshMaster) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_AzmayeshDetail").
            items.select("Id,Title,Result,Azmayesh/Title,Azmayesh/Id,Azmayesh/Code,Azmayesh/Description,MasterID/Id").
            expand("Azmayesh,MasterID").
            filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
                resolve(items);
            });
    });
}
function GetAzmayeshName() {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_AzmayeshName").
            items.select("Id,Title,Category/Id,Category/Title").
            expand("Category").
            //   filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
                resolve(items);
            });
    });
}
function GetAzmayeshPeriod() {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_AzmayeshPeriod").
            items.select().
            //expand("Category").
            //   filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
                resolve(items);
            });
    });
}
function GetRefrenceRange(AzmayeshMaster, AzmayeshDetailItem) {

    if ($.isNumeric(AzmayeshDetailItem.Result) == true) {

        // console.log(AzmayeshMaster[0].Gender);
        //  console.log(AzmayeshDetail);
        /*
        try using the lt (less-than) operator instead of <
        Is there leq??I know Lt,Le,Eq,Ne
        Lt less than
        Le less than equal
        Gt freater than
        Ge
        Eq
        Ne
        */

        return new Promise(resolve => {
            $pnp.sp.web.lists.
                getByTitle("GIG_HS_RefrenceRange").
                items.select("Id,Title,Gender/Id,Gender/Title,Azmayesh/Id,Azmayesh/Code,"
                    + "Azmayesh/Title,Status/Id,Status/Title").
                expand("Gender,Azmayesh,Status").
                // filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "')").
                filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "') " +
                    "and (Azmayesh/Id eq " + AzmayeshDetailItem.Azmayesh.Id + ")" +
                    "and (LowRange lt " + AzmayeshDetailItem.Result + ") and (HighRange gt " + AzmayeshDetailItem.Result + ")").
                // orderBy("Modified", true).
                get().
                then(function (items) {
                    resolve(items);
                });
        });
    }
}
function GetFoodAllergy(AzmayeshMaster) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_FoodAllergy").
            items.select("Id,Title,MasterID/Id,MasterID/Title,FoodAllergy/Id,FoodAllergy/Title").
            expand("FoodAllergy,MasterID").
            filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
               // debugger
                resolve(items);
            });
    });
}
function GetDrugAllergy(AzmayeshMaster) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_DrugAllergy").
            items.select("Id,Title,MasterID/Id,MasterID/Title,DrugAllergy/Id,DrugAllergy/Title").
            expand("DrugAllergy,MasterID").
            filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
               // debugger
                resolve(items);
            });
    });
}
function GetBimari(AzmayeshMaster) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_Bimari").
            items.select("Id,Title,MasterID/Id,MasterID/Title,Bimari/Id,Bimari/Title").
            expand("Bimari,MasterID").
            filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
               // debugger
                resolve(items);
            });
    });
}
//-------------------------------------------------------
function foramtDate(str) {
    return str.slice(0, 2) + "/" + str.slice(2, 4) + "/" + str.slice(4, 6)
}
function splitString(str) {
    return str.split(";#")
}
//-----------------------
