var foreignKey = 0;
var CurrentCID = 0;
var CurrentPID = 0;
var xxx = 0;
var yyy = "";
var dore = 0;
var _Bimary = [];
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
GIG_HS_BimariLookup 
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


    ShowBimariLookup();
    showFormula();
    showAlarmBimary();

});
//---------------------------------------

//-------------------------------------------------------

async function ShowBimariLookup() {
    var BimariLookup = await GetBimariLookup();
    $("#tableres table").remove()
    var table = "<table class='tblH table'>"
    table += "<tr>"
    table += "<th>ردیف</th><th>عنوان</th><th>فرمول</th><th>توضیحات</th>"
    table += "</tr>"
    for (let i = 0; i < BimariLookup.length; i++) {

        if (BimariLookup.length > 0) {

            table += "<tr>"
            table += "<td>"
            table += i + 1
            table += "</td>"
            table += "<td>"
            table += BimariLookup[i].Title
            table += "</td>"
            table += "<td style='direction: ltr;'>"
            table += "<textarea onchange=saveFormula(" + BimariLookup[i].Id + ",this) cols=60>" + BimariLookup[i].Formula + "</textarea>"
            table += "</td>"
            table += "<td style='direction: rtl;'>"
            table += "<textarea onchange=saveAlarm(" + BimariLookup[i].Id + ",this) cols=40>" + BimariLookup[i].alarm + "</textarea>"
            table += "</td>"
            table += "<tr>"

        }
    }
    table += "</table>"
    $("#tableres").append(table);

}
function saveFormula(id, thiss) {
    var c = confirm('آیا ذخیره انجام شود?\n' + "شماره ردیف : " + id + "\n" + $(thiss).val());

    if (c) {
        var res = $(thiss).val()
        updateGIG_HS_BimariLookup(id, res,"Formula")
    }
    else {
        // No clicked
    }


}
function saveAlarm(id, thiss) {
    var c = confirm('آیا ذخیره انجام شود?\n' + "شماره ردیف : " + id + "\n" + $(thiss).val());

    if (c) {
        var res = $(thiss).val()
        updateGIG_HS_BimariLookup(id, res,"Alarm")
    }
    else {
        // No clicked
    }


}






async function showFormula() {
    $("#tableres2 select").remove()

    var AzmayeshName = await GetAzmayeshName();

    var table = "<table class='tblH table'>"
    table += "<tr>"
    table += "<th>ردیف</th><th>عنوان</th><th>فرمول</th>"
    table += "</tr>"
    for (var i = 0; i < AzmayeshName.length; i++) {
        table += "<tr>"
        table += "<td>"
        table += AzmayeshName[i].Id
        table += "</td>"
        table += "<td>"
        table += AzmayeshName[i].Title
        table += "</td>"
        table += "<td>"
        table += AzmayeshName[i].Code
        table += "</td>"
        table += "<tr>"
    }
    table += "</table>"
    $("#tableres2").append(table);
}
async function showAlarmBimary() {
    var BimariLookup = await GetBimariLookup();

    for (let index = 0; index < BimariLookup.length; index++) {
        var boolRes = true
        if (BimariLookup[index].Formula == null) {

            _Bimary.push({ Title: BimariLookup[index].Title, Result: false, Alarm: BimariLookup[index].alarm })
            continue
        }
        var result = BimariLookup[index].Formula.split(",")
        for (let index = 0; index < result.length; index++) {

            var AzmayeshDetail = await GetAzmayeshDetail(result[index]);
            if (AzmayeshDetail.length == 0) {
                boolRes = false
            }
        }

        _Bimary.push({ Title: BimariLookup[index].Title, Result: boolRes, Alarm: BimariLookup[index].alarm })
        // debugger
    }
    console.log(_Bimary);

}


//-------------------------------------------------------

function GetAzmayeshDetail(filter) {

    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_AzmayeshDetail").
            items.select("Id,Title,Result,Azmayesh/Title,Azmayesh/Id,Azmayesh/Code,Azmayesh/Description,MasterID/Id").
            expand("Azmayesh,MasterID").
            filter(filter).
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
            items.select("Id,Title,Category/Id,Category/Title,Code").
            expand("Category").
            //   filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
                resolve(items);
            });
    });
}

//آیا این بیماری خاص را دارد یا نه ؟
function GetRefrenceRange(AzmayeshMaster, AzmayeshDetailItem, BimariLookup) {
    debugger
    if ($.isNumeric(AzmayeshDetailItem.Result) == true) {

        // console.log(AzmayeshMaster[0].Gender);
        //  console.log(AzmayeshDetailItem.Result);
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
                items.select("Id,Title,Gender/Id,Gender/Title,Azmayesh/Id,Azmayesh/Code,Azmayesh/Title,AsarBarBimari/Title,AsarBarBimari/Id,Status/Id,Status/Title,"
                    + "Normal,LowRange,HighRange,BasisOfComparison,MinAge," +
                    "MoreRange,LessRange").
                expand("Gender,Azmayesh,Status,AsarBarBimari").
                // filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "')").
                filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "') " +
                    "and (Azmayesh/Id eq " + AzmayeshDetailItem.Azmayesh.Id + ")" +
                    "and (LowRange lt " + AzmayeshDetailItem.Result + ") and (HighRange gt " + AzmayeshDetailItem.Result + ")").
                // orderBy("Modified", true).
                get().
                then(function (items) {
                    console.log(items)
                    resolve(items);
                });
        });
    }
    /*
    else
    {
        console.log(AzmayeshDetailItem.Result);
        console.log(splitString(AzmayeshDetailItem.Result))
        return new Promise(resolve => {
            $pnp.sp.web.lists.
                getByTitle("GIG_HS_RefrenceRange").
                items.select("Id,Title,Gender/Id,Gender/Title,Azmayesh/Id,Azmayesh/Code,"
                    + "Azmayesh/Title,Status/Id,Status/Title,Normal,MoreRange,LessRange").
                expand("Gender,Azmayesh,Status").
                // filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "')").

                // filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "') " +
                //     "and (Azmayesh/Id eq " + AzmayeshDetailItem.Azmayesh.Id + ")" +
                //     "and (LowRange lt " + AzmayeshDetailItem.Result + ") and (HighRange gt " + AzmayeshDetailItem.Result + ")").
                // orderBy("Modified", true).
                get().
                then(function (items) {
                    resolve(items);
                });
        });  
    }
    */
}
//لیست مواردی که بر روی بیماری تاثیر دارند
function GetRefrenceRangeFilterAsarBarBimari(AzmayeshMaster, BimariLookup) {
    // debugger
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_RefrenceRange").
            items.select("Id,Title,Gender/Id,Gender/Title,Azmayesh/Id,Azmayesh/Code,Azmayesh/Title,AsarBarBimari/Title,AsarBarBimari/Id,Status/Id,Status/Title,"
                + "Normal,LowRange,HighRange,BasisOfComparison,MinAge," +
                "MoreRange,LessRange").
            expand("Gender,Azmayesh,Status,AsarBarBimari").
            //filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "') and (AsarBarBimari/Id eq "+BimariLookup.Id+")").
            filter("(AsarBarBimari/Id eq " + BimariLookup.Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
                // debugger
                // console.log(items)
                resolve(items);
            });
    });

}
function GetRefrenceRange(AzmayeshMaster, AzmayeshDetailItem) {

    if ($.isNumeric(AzmayeshDetailItem.Result) == true) {

        // console.log(AzmayeshMaster[0].Gender);
        //  console.log(AzmayeshDetailItem.Result);
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
                items.select("Id,Title,Gender/Id,Gender/Title,Azmayesh/Id,Azmayesh/Code,Azmayesh/Title,AsarBarBimari/Title,AsarBarBimari/Id,Status/Id,Status/Title,"
                    + "Normal,LowRange,HighRange,BasisOfComparison,MinAge," +
                    "MoreRange,LessRange").
                expand("Gender,Azmayesh,Status,AsarBarBimari").
                // filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "')").
                filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "') " +
                    "and (Azmayesh/Id eq " + AzmayeshDetailItem.Azmayesh.Id + ")" +
                    "and (LowRange lt " + AzmayeshDetailItem.Result + ") and (HighRange gt " + AzmayeshDetailItem.Result + ")").
                // orderBy("Modified", true).
                get().
                then(function (items) {
                    console.log(items)
                    resolve(items);
                });
        });
    }
    /*
    else
    {
        console.log(AzmayeshDetailItem.Result);
        console.log(splitString(AzmayeshDetailItem.Result))
        return new Promise(resolve => {
            $pnp.sp.web.lists.
                getByTitle("GIG_HS_RefrenceRange").
                items.select("Id,Title,Gender/Id,Gender/Title,Azmayesh/Id,Azmayesh/Code,"
                    + "Azmayesh/Title,Status/Id,Status/Title,Normal,MoreRange,LessRange").
                expand("Gender,Azmayesh,Status").
                // filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "')").

                // filter("(Gender/Title eq '" + AzmayeshMaster[0].Gender + "') " +
                //     "and (Azmayesh/Id eq " + AzmayeshDetailItem.Azmayesh.Id + ")" +
                //     "and (LowRange lt " + AzmayeshDetailItem.Result + ") and (HighRange gt " + AzmayeshDetailItem.Result + ")").
                // orderBy("Modified", true).
                get().
                then(function (items) {
                    resolve(items);
                });
        });  
    }
    */
}
function GetBimariLookup() {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_BimariLookup").
            items.select("Id,Title,Formula,alarm").
            // expand("FoodAllergy,MasterID").
            //filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
                resolve(items);
            });
    });
}
function GetBimary(AzmayeshMaster) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("GIG_HS_Bimari").
            items.select("Id,Title,MasterID/Id,MasterID/Title,Bimari/Id,Bimari/Title").
            expand("Bimari,MasterID").
            filter("(MasterID/Id eq " + AzmayeshMaster[0].Id + ")").
            // orderBy("Modified", true).
            get().
            then(function (items) {
                // 
                resolve(items);
            });
    });
}
function updateGIG_HS_BimariLookup(id, formula,type) {
if(type=="Formula")
{
    var list = $pnp.sp.web.lists.getByTitle("GIG_HS_BimariLookup");
    list.items.getById(id).update({
        Formula: formula,
    }).then(function (item) {
        console.log(item);
    });
}
if(type=="Alarm")
{
    var list = $pnp.sp.web.lists.getByTitle("GIG_HS_BimariLookup");
    list.items.getById(id).update({
        alarm: formula,
    }).then(function (item) {
        console.log(item);
    });
}
}

//-------------------------------------------------------
function foramtDate(str) {
    return str.slice(0, 2) + "/" + str.slice(2, 4) + "/" + str.slice(4, 6)
}
function splitString(str) {
    return str.split(";#")
}
function SeparateThreeDigits(str) {
    var x = parseInt(str);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // return parseInt(str);
}
//-----------------------
