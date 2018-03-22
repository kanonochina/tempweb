var wpia = jQuery.noConflict();
function showLoader($this){
    $this.find('.wpia-loading').fadeTo(0,0).css('display','block').fadeTo(200,1);
    $this.find('.wpia-calendar ul').animate({
        'opacity' : '0.7'
    },200);
}
function hideLoader(){
    wpia('.wpia-loading').css('display','none');
}
function changeDay(direction, timestamp, $this){
    var data = {
		action: 'wpia_changeDay',
        calendarDirection: direction,
		totalCalendars: $this.find(".wpia-total-calendars").attr('data-total-calendars'),
        currentTimestamp: timestamp,
        calendarHistory: $this.find(".wpia-calendar-history").attr('data-calendar-history'),
        showLegend: $this.find(".wpia-show-legend").attr('data-show-legend'),
        showDropdown: $this.find(".wpia-show-dropdown").attr('data-show-dropdown'),
        showWeekNumbers: $this.find(".wpia-calendar-weeknumbers").attr('data-calendar-weeknumbers'),
        calendarLanguage: $this.find(".wpia-calendar-language").attr('data-calendar-language'),
        weekStart : $this.find(".wpia-calendar-week-start").attr('data-calendar-week-start'),
        jump : $this.find(".wpia-calendar-jump").attr('data-calendar-jump'),
        calendarID : $this.find(".wpia-calendar-ID").attr('data-calendar-ID')
        
	};
	wpia.post(wpia_ajaxurl, data, function(response) {
		$this.find('.wpia-calendars').html(response);
        hideLoader();     
        $this.find('.wpia-dropdown').customSelect();
	});
}

wpia(document).ready(function(){

    if ( typeof jQuery.fn.select2 !== 'undefined' )
        wpia('select[name="month"]').each(function () { wpia(this).select2('destroy'); });

    wpia('.wpia-dropdown').customSelect();
    wpia('div.wpia-container').each(function(){
        
        var $instance = wpia(this);
        
        wpia($instance).on('change','.wpia-dropdown',function(e){
            showLoader($instance);     
            e.preventDefault();        
            changeDay('jump',wpia(this).val(), $instance)
        });
        
        wpia($instance).on('click','.wpia-prev',function(e){
            showLoader($instance);
            e.preventDefault();
            timestamp = $instance.find(".wpia-current-timestamp").attr('data-current-timestamp');
            changeDay('prev',timestamp, $instance);
        });
        
        
        wpia($instance).on('click','.wpia-next',function(e){  
            showLoader($instance);
            e.preventDefault();     
            timestamp = $instance.find(".wpia-current-timestamp").attr('data-current-timestamp'); 
            changeDay('next',timestamp, $instance);
        });
    
    });
    
    wpia("div.wpia-container").on('mouseenter','li.wpia-day', function(){        
        $li = wpia(this);
        if(typeof $li.attr('data-tooltip') != 'undefined'){
            $li.addClass('wpia-tooltip-active');
            $li.append('<div class="wpia-tooltip"><strong>' + $li.attr('data-tooltip-date') + '</strong>' + $li.attr('data-tooltip') + '</div>');    
        }            
    });    
      
    wpia("div.wpia-container").on('mouseleave','li.wpia-day', function(){
        wpia(".wpia-tooltip-active").removeClass('wpia-tooltip-active');        
        wpia("li.wpia-day .wpia-tooltip").remove();
            
    });

    // Overview stuff

    var changeOverview = function( timestamp, $this)
    {
        var data = {
            action: 'wpia_changeOverview',
            currentTimestamp: timestamp,
            showLegend: $this.find(".wpia-show-overview-legend").attr('data-show-legend'),
            showTooltip: $this.find(".wpia-calendar-overview-tooltip").attr('data-calendar-tooltip'),
            showWeekNumbers: $this.find(".wpia-calendar-overview-weeknumbers").attr('data-calendar-weeknumbers'),
            calendars: $this.find(".wpia-calendar-overview-calendars").attr('data-calendars'),
            calendarLanguage: $this.find(".wpia-calendar-overview-language").attr('data-calendar-language'),
        };

        wpia.ajax({
            url:        wpia_ajaxurl,
            data:       data,
            method:     'post',
            dataType:   'json',
            success:    function ( obj )
            {
                var $content     = $this.find('.wpia-overview-content');

                $content.parent('.wpia-overview-calendar').parent('.wpia-overview-calendar-container').find('[name="month"]').html(obj.months);

                if ( $content.length > 0 )
                {
                    $content.html( obj.html );
                    destroyOverviewOverlay( $content );
                }
                else
                    return;
            }
        });
    }

    var appendOverviewOverlay = function( inst )
    {
        inst.find('.wpia-overview-content').prepend('<div class="wpia-overlay"><div class="progress"><div class="indeterminate"></div></div></div>');
        wpia(document).trigger('wpia-overview-overlay');
        return;
    }
    var destroyOverviewOverlay = function( inst )
    {

        var destroyTimeout = setTimeout( function () {
            inst.find('.wpia-overlay').fadeOut(350, function () {
              wpia( this ).remove();  
            });
            wpia(document).trigger('wpia-overview-destroy');
            return;
        }, 350);
        return;
    }

    wpia('.wpia-overview-calendar').each(function () {
        var $inst       = wpia( this );           

        $inst.parent('.wpia-overview-calendar-container').find('[name="month"]').on('change',function(e)
        {
            e.preventDefault();
            appendOverviewOverlay($inst);
            changeOverview(wpia(this).val(), $inst );
        });
        
    });
})
$ = jQuery.noConflict();