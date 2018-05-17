/*
* Instructions:
*
*   - Has to be included after jQuery 3+. <-------------- IMPORTANT
*
*   - Include IOFilterJS.js and IOFilterJS.css .
*     If you somehow downloaded this without IOFilterJS.css, read on and you can create it easily on your own.
*
*   - Read the docs under those instructions to understand how to structure buttons/elements. The example helps!
*
* Has the following structure:
* Filters:  All buttons are of the form :
*           <button class="IOFilterJS ['IOFilterJSdefault']"  filterName ="<filterName>" filterAttribute="<Attribute>"
*           buttonGroup=<groupName> [exclusive=""]>
*               Name
*           </button>
*           filterName          is the name of the filter the button/element belongs to. Provides scope.
*           buttonGroup         is the group of buttons - an individual button is a group with 1 member - no group = button ignored
*           ['IOFilterJSdef']   is what you put in a button that you want to on by default.
*           filterAttribute     is the attribute the element should have
*           [exclusive]           is true if you want to turn off all other buttons in <buttonGroup> when current button is pressed.
*                               If exclusive is defined, will not toggle off an active button when you press it.
*                               Should be the same for the whole group to avoid bugs.
*           Pressing a button toggles it, and updated the visibility of all elements with the class filterName
*
*           All divs/paragraphs/other-elements are of the form:
 *           <element class="IOFilterJS" IOFilterJS="<AttributeA> <AttributeB> ..."> Some content </element>
 *          Is selected if its attributes satisfy each of the current active button groups (and each button without group).
 *
 *          A div that is currently selected gets the class IOFilterJS-selected, a div that isn't gets IOFilterJS-hidden.
 *          An active button gets the class IOFilterJS-active, an inactive one gets IOFilterJS-inactive.
 *          There is a default css file for those, but you can play with them however you like. You can even make this filter
 *          into a highlighter instead.
 *
 *         Example:
 *          buttonGroupA:
 * Button 1     <button class = 'IOFilterJS' filterName ="A" buttonGroup="groupA" filterAttribute="hasFood">
 *              Has Food
 *              </button>
 *
 * Button 2     <button class = 'IOFilterJS' filterName ="A" buttonGroup="groupA" filterAttribute="hasShoes">
 *              Has Shoes
 *              </button>
 *
 * Button 3     <button class = 'IOFilterJS IOFilterJSdefault' filterName ="A" buttonGroup="groupB" filterAttribute="allCountries" exclusive="">
 *              allCountries
 *              </button>
 *
 * Button 4     <button class = 'IOFilterJS' filterName ="A" buttonGroup="groupB" filterAttribute="northKorea" exclusive="">
 *              northKorea
 *              </button>
 *
 * Button 5     <button class = 'IOFilterJS' filterName ="A" buttonGroup="groupB" filterAttribute="zimbabwe" exclusive="">
 *              zimbabwe
 *              </button>
 *
 * Element 1    <div class="IOFilterJS" filterName ="A" IOFilterJS="allCountries northKorea hasShoes hasFood">Chon</div>
 *
 * Element 2    <div class="IOFilterJS" filterName ="A" IOFilterJS="allCountries northKorea hasFood">Kim</div>
 *
 * Element 3    <div class="IOFilterJS" filterName ="A" IOFilterJS="allCountries northKorea hasShoes">Chao</div>
 *
 * Element 4    <div class="IOFilterJS" filterName ="A" IOFilterJS="allCountries zimbabwe">Kembo</div>
 *
 * Element 5    <div class="IOFilterJS" filterName ="A" IOFilterJS="allCountries zimbabwe hasShoes">Mutare</div>
 *
 * Element 6    <div class="IOFilterJS" filterName ="A" IOFilterJS="allCountries zimbabwe hasFood">Chinhoyi</div>
 *
 *
 * Active Button Configuration                 Selected Elements
 * Default (3)                                  1, 2, 3, 4, 5, 6
 * If you forgot to set a default               1, 2, 3, 4, 5, 6 (nothing from groupB is filtered when no buttons are active)
 * 1, 2, 3                                      1
 * 1, 3                                         1, 2, 6
 * 1, 2, 5                                      none
 * 5                                            4, 5, 6
 * 2, 4                                         1, 3
* */

function IOFilterJSInit(){
    $(function(){
        document.IOFilterJS = {};
        //Global object, whoes state will change according to active buttons
        let seenFilters = [];
        $( "button.IOFilterJS" ).each(function() {
            //If the button doesn't have the required attributes, it is ignored
            if(($(this).attr('buttonGroup') !== undefined )
                && ($(this).attr('filterName') !== undefined )
                && ($(this).attr('filterAttribute') !== undefined )){
                //Fetch the attributes
                let filter = $(this).attr('filterName');
                if(!seenFilters.includes(filter))
                    seenFilters.push(filter);
                let group = $(this).attr('buttonGroup');
                let attr = $(this).attr('filterAttribute');
                //Create the needed filter if it's unset
                if(document.IOFilterJS[filter] === undefined)
                    document.IOFilterJS[filter] = {};
                //Create the needed group if it's unset
                if(document.IOFilterJS[filter][group] === undefined)
                    document.IOFilterJS[filter][group] = {};
                //Create the needed attr if it's unset
                if(document.IOFilterJS[filter][group][attr] === undefined){
                    document.IOFilterJS[filter][group][attr] = false;
                }
                //if there is a default on button, set attr to true
                if($(this).hasClass("IOFilterJSdefault") === true){
                    document.IOFilterJS[filter][group][attr] = true;
                    $(this).addClass('IOFilterJS-active');
                }
                else{
                    $(this).addClass('IOFilterJS-inactive');
                }
                //Finally, set an class for the button that should be unique - not ID, because I dont want to override it.
                $(this).addClass('IOFilterJS-'+filter+group+attr);
            }
        });

        $('div.IOFilterJS').each(function(){
            $(this).addClass('IOFilterJS-hidden');
        });

        seenFilters.forEach(function(element) {
            IOFilterJS(element);
        });


    });
}

function IOFilterJS(filterName, groupName, filterAttribute, exclusive = false){

    if(filterName !== undefined){
        //This toggles the button (unless exclusive is true and the button is on), and turns the other buttons in the
        //group off if exclusive is true
        if((groupName !== undefined) && (filterAttribute !== undefined)){
            //To faster select the current button
            let butClass = 'IOFilterJS-'+filterName + groupName + filterAttribute ;
            currButton = $('button.'+butClass);
            //If this isn't an exclusive call, just toggle the button
            if(!exclusive){
                if(document.IOFilterJS[filterName][groupName][filterAttribute] === true){
                    document.IOFilterJS[filterName][groupName][filterAttribute] = false;
                    currButton.removeClass('IOFilterJS-active').addClass('IOFilterJS-inactive');
                }
                else{
                    document.IOFilterJS[filterName][groupName][filterAttribute] = true;
                    currButton.removeClass('IOFilterJS-inactive').addClass('IOFilterJS-active');
                }
            }
            //Else, check if the button is off (if it's on, do nothing), if no toggle it on and the others in the group off
            else{
                if(document.IOFilterJS[filterName][groupName][filterAttribute] === false){
                    //Iterate over all the group items and turn the one that's on - off
                    for (let key in document.IOFilterJS[filterName][groupName]) {
                        if (document.IOFilterJS[filterName][groupName].hasOwnProperty(key)) {
                            if(document.IOFilterJS[filterName][groupName][key] === true){
                                document.IOFilterJS[filterName][groupName][key] = false;
                                $('button.IOFilterJS-'+filterName + groupName + key).removeClass('IOFilterJS-active').addClass('IOFilterJS-inactive');
                            }
                        }
                    }
                    //turn our button on
                    document.IOFilterJS[filterName][groupName][filterAttribute] = true;
                    currButton.removeClass('IOFilterJS-inactive').addClass('IOFilterJS-active');
                }
            }
        }
        //In case filterName is the only defined value - just updated all objects
        $('div.IOFilterJS').each(function(){
            if($(this).attr('filterName')==filterName){
                //Has to have some attributes to filter by
                if($(this).attr('IOFilterJS') !== undefined){
                    $pass = true;
                    let classList = $(this).attr('IOFilterJS').split(/\s+/);
                    //If it satisfies at least one attribute of each group, let it pass
                    //loop per group - exit if you fail one
                    for (let group in document.IOFilterJS[filterName]) {
                        if (document.IOFilterJS[filterName].hasOwnProperty(group)) {
                            let failGroup = false;
                            //loop per attr - exit if you passed one (aka passed this specific group)
                            for (let attr in document.IOFilterJS[filterName][group]) {
                                if (document.IOFilterJS[filterName][group].hasOwnProperty(attr)) {
                                    //If at least one of the attributes if true, you pass the attr;
                                    if(!classList.includes(attr) && document.IOFilterJS[filterName][group][attr] === true){
                                            failGroup = true;
                                            break;
                                    }
                                }
                                if(failGroup)
                                    break;
                            }
                            if(failGroup){
                                $pass = false;
                                break;
                            }
                        }
                    }
                    //If it passes, select it if it isn't currently selected
                    if($pass){
                        if($(this).hasClass('IOFilterJS-hidden'))
                            $(this).removeClass('IOFilterJS-hidden').addClass('IOFilterJS-selected');
                    }
                    //If it doesn't pass, deselect it if it is currently selected
                    else{
                        if($(this).hasClass('IOFilterJS-selected') )
                            $(this).removeClass('IOFilterJS-selected').addClass('IOFilterJS-hidden');
                    }
                }
            }
        });
    }

}

//This has to run now!
IOFilterJSInit();

$(function(){
    $("button.IOFilterJS").click(function(){
        //Get all attributes
        let filterName = $(this).attr('filterName');
        let groupName = $(this).attr('buttonGroup');
        let filterAttribute = $(this).attr('filterAttribute');
        let exclusive = $(this).attr('exclusive');
        //exclusive isn't always set
        (exclusive === undefined)?
            exclusive = false: exclusive = true;
        //Again, make sure this is a legit button
        if(filterName !== undefined && groupName !== undefined && filterAttribute !== undefined ){
            IOFilterJS(filterName, groupName, filterAttribute, exclusive);
        }
    });

});

