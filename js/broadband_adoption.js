jQuery(function($){

  // initialize d3 charts
  buildChart();

  function buildChart() {
    var adoptChartMobile = false;
    var adoptChartDesktop = false;
    var adoptChartEl = $('.adoption-chart');

    // check if element is in the viewport
    var isInViewport = function(el) {
      var elementTop = el.offset().top;
      var elementBottom = elementTop + el.outerHeight();
      var viewportTop = jQuery(window).scrollTop();
      var viewportBottom = viewportTop + jQuery(window).height();
      return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $(window).on('load scroll resize', function() {
      var throttled = false;
      var delay = 250;

      // only run if we're not throttled
      if (!throttled) {
        var w = window.innerWidth;

        // Desktop
        if (w > 767) {
          if (!$('.adoption-chart svg.desktop').length && isInViewport(adoptChartEl)) {
            if ($('.adoption-chart svg').length) {
              removeAdoptChart();
            }
            adoptionChart(w);
          }
        }
        else { // Mobile
          if (!$('.adoption-chart svg.mobile').length && isInViewport(adoptChartEl)) {
            if ($('.adoption-chart svg').length) {
              removeAdoptChart();
            }
            adoptionChart(w);
          }
        }

        // we're throttled!
        throttled = true;

        // set a timeout to un-throttle
        setTimeout(function() {
          throttled = false;
        }, delay);
      }
    });
  }

  function removeAdoptChart() {
    $('.adoption-chart svg').remove();
  }


  // broadband adoption chart
  function adoptionChart(w) {
    var data, margin, width, outerWidth, height, outerHeight, viewBox, parseDate,
        x, y, tickLabels, xAxis, yAxis, initialArea, area, svg, wrapClass;

    // broadband adoption data
    data = [{"year":"2000", "percent": 3},
            {"year":"2005", "percent": 32},
            {"year":"2010", "percent": 62},
            {"year":"2015", "percent": 68},
            {"year":"2020", "percent": 81}];

    outerWidth = 1140;
    if (w > 767) {
      outerHeight = 500;
      wrapClass = 'desktop';
    }
    else {
      outerHeight = 700;
      wrapClass = 'mobile';
    }

    // dimensions
    margin = {top: 20, right: 20, bottom: 40, left: 40};
    width = outerWidth - margin.left - margin.right;
    height = outerHeight - margin.top - margin.bottom;
    viewBox = "0 0 " + outerWidth + " " + outerHeight;

    parseDate = d3.time.format("%Y").parse;

    x = d3.time.scale()
        .range([0, width]);

    y = d3.scale.linear()
        .range([height, 0]);

    tickLabels = ["2000", "2005", "2010", "2015", "2019"];

    xAxis = d3.svg.axis()
        .ticks(5)
        .scale(x)
        .tickFormat(function(d,i){ return tickLabels[i] })
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(y)
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickFormat(function(d,i){
          return d + "%";
        })
        .orient("left");

    initialArea = d3.svg.area()
        .x(0)
        .y0(height)
        .y1(height);

    area = d3.svg.area()
        .x(function(d) { return x(d.year); })
        .y0(height)
        .y1(function(d) { return y(d.percent); });

    svg = d3.select(".adoption-chart").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", viewBox)
        .attr("class", wrapClass)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Take each row and put the date column through the parsedate form we've defined above.
    data.forEach(function(d) {
      d.year = parseDate(d.year);
    });

    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0,100]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
      svg.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("fill", "#E71B4F")
          .attr("d", initialArea) // initial state (line at the bottom)
          .transition()
          .duration(2000)
          .ease("linear")
          .attr("d", area);
  }


});
