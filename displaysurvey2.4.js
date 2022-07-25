//Val Api Releas

//Import jquery

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//import qp
var qpimport = document.createElement('script');
script.src = 'https://admin.questionpro.com/javascript/min/in.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(qpimport);


var footerElem = ".custom-footer-wrapper";
var alertContent = "#ContenAlert";
var itemCheck = "#Check_ID";
var SvID1 = "10139478"; //ID de encuesta de validación de usuario.
var SvID2 = "8231555"; //ID de encuesta de validación de respuesta.
var APIKey = "f0b19738-c8a4-4a02-aee7-29b0a08cba1e"; //Llave API

setTimeout(function(){ 
    $(footerElem).hide();
   $(".take-survey-title").hide();
   $("#SurveySubmitButtonElement").hide();
}, 500);

setTimeout(function(){ 
    EvalUserSecure();
}, 500);

function EvalUserSecure(){
    var checkUserID = $(itemCheck).text();
    CheckTrackVal(checkUserID, 0, "");
    console.log(checkUserID);
}

function CheckTrackVal(checkID, trackCheck, segmTxt){
    var track = trackCheck; track++;

    switch(track) {
        case 1: get_resdata(checkID, track, SvID1, segmTxt); console.log("Se detectó información: " + track); break;  //Primero Se verifica si existe el ususario en el registro de clientes
        case 2: get_resdata(checkID, track, SvID2, segmTxt); console.log("Se hace check case 2: " + track); break; //Segundo Se valida si no hay respuesta previa - 404
        case 3: DisplayCXSurvey(segmTxt); console.log("Se hace check case 3: " + track + "DisplayCXSurvey" + segmTxt);break; //Se incluye el script del Popup a mostrar
      default:CreateAlert("Ha ocurrido un error al procesar la información al inicio del procesamiento");
    }
}

function get_resdata(checkID, trackCheck, SvID, segmTxt) {
   var _c1 = checkID;
   var segmse = segmTxt;
    $.ajax({
        url: "https://api.questionpro.com/a/api/v2/surveys/" + SvID + "/responses/filter?custom1="+ _c1 +"&apiKey=" + APIKey, //Filtra por correo electrónico
        type: "get",
        contentType: 'application/json',
        crossDomain:true,
        dataType: "json",
        async: false,
        success: function(data) { //Si la petición fue correcta.
           var _responses = data['response']; 
           var response_count = _responses.length;
           
           //Debug
            console.log(response_count);

           if(response_count > 0) //Se tiene registro de este ID
           {
                if(trackCheck == 1){ 
                    var segTxt = _responses[0]['customVariables']['custom2']; //Obtenemos el código de segmento alojado en la c2
                    CheckTrackVal(checkID, trackCheck, segTxt); 
                    console.log(segTxt);
                }else{
                    console.log("El usuario ya ha contestado la encuesta previamente");
                }
           } 

        }, 
        
        error: function(err) { 
             
            //Valida retorno de ajax
            if(segmse){

                console.log("Cliente sin respuesta"); //Cliente tiene segmento pero no tiene respuesta - 
                noresulthandler();

            } else{
                console.log("No se encontraron registros de Cliente o Respuesta alguna"); //No existe el cliente en la BD
               
            }
                
        }
       
    });

    function noresulthandler (){ 
        DisplayCXSurvey(segmse)
    }


};

function DisplayCXSurvey(segm){
        console.log("Mostrando pop up del segmento: " + segm);
        window.QPROSurvey = {};window.QPROSurvey.settings = {inID : "fPUimZsN", segmentCode : segm, appURL : "https://admin.questionpro.com"};
        var isMobile=-1!=navigator.userAgent.toLowerCase().search("mobile")&&-1==navigator.userAgent.toLowerCase().search("ipad"),is_chrome=navigator.userAgent.toLowerCase().indexOf("chrome")>-1,defaultDomain="https://www.questionpro.com",interceptVersion="1.2";window.QPROSurvey||(window.QPROSurvey={},window.QPROSurvey.settings={inID:inID,segmentCode:segmentCode,appURL:appURL},domain&&(domain=domain.replace("/a/",""),window.QPROSurvey.settings.domain=domain),console.warn("Deprecation Warning: New version of the embed code is available.")),window.QPROSurvey.settings.domain||(window.QPROSurvey.settings.domain=defaultDomain),window.QPROSurvey.settings.appURL?window.QPROSurvey.settings.domain=window.QPROSurvey.settings.appURL:console.warn("Deprecation Warning: New version of the embed code is available."),function(a){window.QPROSurvey.settings.domain||(window.QPROSurvey.settings.domain=window.QPROSurvey.settings.appURL?window.QPROSurvey.settings.appURL:defaultDomain);var b=document.createElement("link");b.setAttribute("type","text/css"),b.setAttribute("href",a.domain+"/stylesheets/intercept/intercept.css"),b.setAttribute("rel","stylesheet"),document.body.appendChild(b);var c=document.createElement("script");c.setAttribute("src",a.domain+"/javascript/2015/jquery-3.5.1.min.js"),document.body.appendChild(c);var d=document.createElement("script");d.setAttribute("src",a.domain+"/javascript/min/intercept.js?version="+interceptVersion),c.onload=function(){document.body.appendChild(d)}}(window.QPROSurvey.settings);
//# sourceMappingURL=in.js.map
        console.log(window.QPROSurvey);
}

function CreateAlert(msg){
    $(alertContent).before('<div id="AlertUser" style="display:none; text-align:center; padding:20px; width:100%; color:#155724; background-color:#d4edda; border-color:#c3e6cb; box-shadow: 0 0 10px #c3e6cb;"><span><i class="fa fa-info-circle"></i> '+msg+'</span></div>');   
    setTimeout(function(){ 
        $("#AlertUser").fadeIn();
    }, 500);
    setTimeout(function(){ 
        $("#AlertUser").fadeOut();
    }, 5000);
}
