document.getElementsByClassName("sign-up")[0].addEventListener("click",viewSignUpform);
document.getElementsByClassName("apply-for-staff")[0].addEventListener("click",viewApplyForStaffform);


function viewSignUpform(){
$(".sign-up-for-tournament").fadeToggle();
$(".sign-up-arrow").toggleClass("down");
}

function viewApplyForStaffform(){
  $(".apply-for-stuff-form").fadeToggle();
  $(".apply-for-staff-arrow").toggleClass("down");
}
