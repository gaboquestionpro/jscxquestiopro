//import jquery

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

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

function CheckTrackVal(checkID, trackCheck, segmTxt, inID){
    var track = trackCheck; track++;

    switch(track) {
        case 1: get_resdata(checkID, track, SvID1, segmTxt, inID); console.log("Se detectó información: " + track); break;  //Primero Se verifica si existe el ususario en el registro de clientes
        case 2: get_resdata(checkID, track, SvID2, segmTxt, inID); console.log("Se hace check case 2: " + track); break; //Segundo Se valida si no hay respuesta previa - 404
        //case 3: DisplayCXSurvey(segmTxt); console.log("Se hace check case 3: " + track + "DisplayCXSurvey" + segmTxt);break; //Se incluye el script del Popup a mostrar
      default:CreateAlert("Ha ocurrido un error al procesar la información al inicio del procesamiento");
    }
}

function get_resdata(checkID, trackCheck, SvID, segmTxt, inID) {
   var _c1 = checkID;
   var segmse = segmTxt;
   var inIDpop = inID;
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
                    var inID =  _responses[0]['customVariables']['custom4']; //Obtenermos el inID (define encuesta a mostrar)
                    CheckTrackVal(checkID, trackCheck, segTxt, inID); 
                    console.log(segTxt + " "+  inID);
                }else{
                    console.log("El usuario ya ha contestado la encuesta previamente");
                }
           } 

        },          

            error: function(err) {  //Sin registros envía a check 3 - No ha contestado la encuesta
                
                if(segmse){

                    console.log("Cliente sin respuesta");
                    noresulthandler();

                } else{
                    console.log("No se encontraron registros de Cliente o Respuesta alguna");
                }
                
           }
       
    });

    function noresulthandler (){
        DisplayCXSurvey(inIDpop,segmse)
    }


};

function DisplayCXSurvey(inIDpop,segm){
    setTimeout(function(){ 
       var jsString = '@script type="text/javascript"#window.QPROSurvey = {};window.QPROSurvey.settings = {inID : "fPUimZsN", segmentCode : "'+segm+'", appURL : "https://admin.questionpro.com"};@/script#@script src="https://admin.questionpro.com/javascript/min/in.js"#@/script#@noscript#@a href="https://admin.questionpro.com"#https://admin.questionpro.com@/a#@/noscript#'; //"H@la# mund@";
       // Original -   var jsString = '@script type="text/javascript"#window.QPROSurvey = {};window.QPROSurvey.settings = {inID : "'+inIDpop+'", segmentCode : "'+segm+'", appURL : "https://www.questionpro.com"};@/script#@script src="https://www.questionpro.com/javascript/min/in.js"#@/script#@noscript#@a href="https://www.questionpro.com"#https://www.questionpro.com@/a#@/noscript#'; //"H@la# mund@";

        jsString = jsString.replaceAll('@','<');
        jsString = jsString.replaceAll('#','>');
        console.log("Se despliega pop up para el segmento: " + segm);
        console.log(jsString);
        $('footer:last').append(jsString);
    }, 100);
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
