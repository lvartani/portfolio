


var mn = $(".main-nav");
mns = "main-nav-scrolled";
hdr = $('header').height();

$(window).scroll(function() {
  if ($(this).scrollTop() > hdr) {
    mn.addClass(mns);
  } else {
    mn.removeClass(mns);
  }
});


$(document).on('click', '.searchbychar', function(event) {
  event.preventDefault();
  var target = "#" + this.getAttribute('data-target');
  $(target).show();
  $('html, body').animate({
    scrollTop: $(target).offset().top
  }, 1500);
});

$(document).on('click', '.searchbychar_fast', function(event) {
  event.preventDefault();
  var target = "." + this.getAttribute('data-target');
  $('html, body').animate({
    scrollTop: $(target).offset().top - 150
  }, 1000);
});




$("#resume").click(function() {
  $("#area").load("resume.html #area > *");
});

$(window).scroll(function() {
  und = "underline";
  if ($(this).scrollTop() > 1850) {
    $('.resume_n').removeClass(und);
    $('.contact_n').addClass(und);
  } else if ($(this).scrollTop() > 1500) {
    $('.project_n').removeClass(und);
    $('.contact_n').removeClass(und);
    $('.resume_n').addClass(und);
    $('#title').css("display", "none");
  } else if ($(this).scrollTop() > 500) {
    $('.about_n').removeClass(und);
    $('.project_n').addClass(und);
    $('.resume_n').removeClass(und);
  } else if ($(this).scrollTop() > 250) {

    $('.about_n').addClass(und);
    $('.project_n').removeClass(und);
    $('.resume_n').removeClass(und);
  } else if ($(this).scrollTop() > 70) {
    $('#iconheader').show();
  } else {
    $('#iconheader').hide();
    $('.about_n').removeClass(und);
    $('#title').css("display", "inline");

  }
});



//END BOXES//





//GLOBE START//

var width = 530,
  height = 680,
  sens = 0.25;


//Setting projection

var projection = d3.geo.orthographic()
  .scale(175)
  .rotate([0, 0])
  .translate([width / 2, height / 2])
  .clipAngle(90);

var path1 = d3.geo.path()
  .projection(projection)
  .pointRadius(function() {
    return 11;
  });;


var title = d3.select("#country_label");


//SVG container

var svgContainer2 = d3.select(".globe").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "globe");


//Adding water

svgContainer2.append("path")
  .datum({
    type: "Sphere"
  })
  .attr("class", "water")
  .attr("d", path1)
  .call(d3.behavior.drag()
    .origin(function() {
      var r = projection.rotate();
      return {
        x: r[0] / sens,
        y: -r[1] / sens
      };
    })
    .on("drag", function() {
      transitioning = false;
      var rotate = projection.rotate();
      projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
      svgContainer2.selectAll("path").attr("d", path1);

    }))


;

var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip");
//countryList = d3.select("body").append("select").attr("name", "countries")


queue()
  .defer(d3.json, "world.json")
  .defer(d3.csv, "world-country-names.csv")
  .defer(d3.csv, "countrynames.csv")
  .await(ready);

function ready(error, world, countryData, countryAll) {

  var countryById = {},
    countries = topojson.feature(world, world.objects.countries).features,
    countries2 = topojson.feature(world, world.objects.countries).features,
    globe = {
      type: "Sphere"
    },
    land = topojson.feature(world, world.objects.land),
    borders = topojson.mesh(world, world.objects.countries, function(a, b) {
      return a !== b;
    }),
    i = -1;


  ;


  countryAll.forEach(function(d) {
    countryById[d.id] = d.name;
  });

  countries = countries.filter(function(d) {
    return countryData.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  n = countries.length;

  //Drawing countries on the globe


  var land = svgContainer2.selectAll("path.land")
    .data(countries2)
    .enter().append("path")
    .attr("class", "land")
    .attr("d", path1)

    .call(d3.behavior.drag()
      .origin(function() {
        var r = projection.rotate();
        return {
          x: r[0] / sens,
          y: -r[1] / sens
        };
      })
      .on("drag", function() {
        transitioning = false;
        var rotate = projection.rotate();
        projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
        svgContainer2.selectAll("path").attr("d", path1);

      }))

    //Mouse events

    .on("mouseover", function(d) {
      countryTooltip.text(countryById[d.id])
        .style("left", (d3.event.pageX + 7) + "px")
        .style("top", (d3.event.pageY - 15) + "px")
        .style("display", "block")
        .style("opacity", 1);
    })
    .on("mouseout", function(d) {
      countryTooltip.style("opacity", 0)
        .style("display", "none");
    })
    .on("mousemove", function(d) {
      countryTooltip.style("left", (d3.event.pageX + 7) + "px")
        .style("top", (d3.event.pageY - 15) + "px");
    });



  var world = svgContainer2.selectAll("path.country")
    .data(countries)
    .enter().append("path")
    .attr("class", "country")
    .attr("d", path1)
    .attr("id", function(d) {
      return "countries" + d.id;
    })


    //Drag event

    .call(d3.behavior.drag()
      .origin(function() {
        var r = projection.rotate();
        return {
          x: r[0] / sens,
          y: -r[1] / sens
        };
      })
    )

    //Mouse events

    .on("mouseover", function(d) {
      countryTooltip.text(countryById[d.id])
        .style("left", (d3.event.pageX + 7) + "px")
        .style("top", (d3.event.pageY - 15) + "px")
        .style("display", "block")
        .style("opacity", 1);
    })
    .on("mouseout", function(d) {
      countryTooltip.style("opacity", 0)
        .style("display", "none");

    })
    .on("click", function(d) {
      console.log(d);
      if (d.name == "Georgia") {
        scroll_country("georgia");
      } else if (d.name == "Armenia") {
        scroll_country("armenia");
      } else if (d.name == "Chile") {
        scroll_country("chile");
      } else if (d.name == "Japan") {
        scroll_country("japan");
      } else if (d.name == "United States") {
        scroll_country("bis");
      }

    })
    .on("mousemove", function(d) {
      countryTooltip.style("left", (d3.event.pageX + 7) + "px")
        .style("top", (d3.event.pageY - 15) + "px")
      // title.text(countries[i].name).style("visability", "hidden");

    });

  d3.csv("cities.csv", function(data) {
    var cities = svgContainer2.append("g")
    cities.selectAll("path.point")
      .data(data)
      .enter()
      .append("path")
      .datum(function(d) {
        return {
          type: "Point",
          coordinates: [d.lon, d.lat],
          rank: d.rank,
          name: d.place,
          radius: d.projects,
          population: d.population
        };
      })

      .attr("class", "point")

      .attr("d", path1)

      .style("fill", "#177597")
      .style("opacity", 0.75)
      .call(d3.behavior.drag()
        .origin(function() {
          var r = projection.rotate();
          return {
            x: r[0] / sens,
            y: -r[1] / sens
          };
        })
        .on("drag", function() {
          transitioning = false;
          var rotate = projection.rotate();
          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
          svgContainer2.selectAll("path").attr("d", path1);

        }))


      .on("mouseover", function(d) {

        d3.select(this).style("fill", "black");
        countryTooltip.text(d.name)
          .style("left", (d3.event.pageX + 7) + "px")
          .style("top", (d3.event.pageY - 15) + "px")
          .style("display", "block")
          .style("opacity", 1);


      })
      .on("mouseout", function(d) {

        d3.select(this).style("fill", "#177597");
        countryTooltip.style("opacity", 0)
        .style("display", "none");

      })
      .on("click", function(d) {
        console.log(d);
        if (d.name == "Boston") {
          scroll_country("bis");
        } else if (d.name == "Los Angeles") {
          scroll_country("luskin");
        } else if (d.name == "New York") {
          scroll_country("ny");
        } else if (d.name == "Chicago") {
          scroll_country("chicago");
        } else if (d.name == "Cupertino") {
          scroll_country("ar");
        } else if (d.name == "Armenia") {
          scroll_country("armenia");
        } else if (d.name == "Chile") {
          scroll_country("chile");
        } else if (d.name == "Japan") {
          scroll_country("japan");
        } else if (d.name == "Georgia") {
          scroll_country("georgia");
        }

      })

  });
  start_transition();

  function start_transition() {

    d3.transition()
      .duration(1850)
      .each("start", function() {
        title.text(countries[i = (i + 1) % n].name);

      })
      .tween("rotate", function() {
        var p = d3.geo.centroid(countries[i]),
          r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projection.rotate(r(t));
          svgContainer2.selectAll("path.country").attr("d", path1);
          svgContainer2.selectAll("path.land").attr("d", path1);
          svgContainer2.selectAll("path.point").attr("d", path1);
        };
      })


      .transition()
      .each("end", start_transition);
  }



  function stop_transition() {
    // console.log("stop");
  }

  function click_transition(i) {
    d3.transition()
      .duration(1850)
      .tween("rotate", function() {
        var p = d3.geo.centroid(countries[i]),
          r = d3.interpolate(projection.rotate(), [-p[0], -p[1]])
        title.text(countries[i].name);

        return function(t) {
          projection.rotate(r(t));
          svgContainer2.selectAll("path.country").attr("d", path1);
          svgContainer2.selectAll("path.land").attr("d", path1);
          svgContainer2.selectAll("path.point").attr("d", path1);
        };
      })
      .transition()
      .each("end", stop_transition);

  }

  function stop1_transition() {
    d3.transition()
      .duration(0);
  }

let toggleEarth = document.querySelector("#btn-check-outlined");
let toggleEarthLabel = document.getElementById("spin-label");


  d3.select("#btn-check-outlined").on("click", function(d, i) {
    stop1_transition();
    let earthSpin = toggleEarth.checked;

    if(earthSpin) {
      stop1_transition();
      $(this).button('toggle');
      toggleEarthLabel.textContent = "SPIN GLOBE"
    } else {
      start_transition()
      $(this).button('toggle');
      toggleEarthLabel.textContent = "STOP GLOBE"
    }

  });
  // d3.select(".start_b").on("click", function(d, i) {
  //   start_transition();
  //   $(this).button('toggle');
  // });




  d3.select(".armenia").on("click", function(d, i) {
    click_transition(0);
  });
  d3.select(".chile").on("click", function(d, i) {
    click_transition(1);
  });
  d3.select(".chile1").on("click", function(d, i) {
    click_transition(1);
  });
  d3.select(".georgia").on("click", function(d, i) {
    click_transition(2);
  });
  d3.select(".japan").on("click", function(d, i) {
    click_transition(3);
  });
  d3.select(".stopspin").on("click", function(d, i) {
    click_transition(4);
  });



}


function scroll_country(scroll) {
  $("." + scroll).css("border-color", "#ffcb00");

  $('html, body').animate({
    scrollTop: $("." + scroll).offset().top - 100
  }, 1000);
  $("." + scroll).mouseout(function() {
    $("." + scroll).delay(1500).css("border-color", "#fff");
  });
  $("." + scroll).mouseover(function() {
    $("." + scroll).css("border-color", "#ffcb00");
  });
}
//END GLOBE//

//
// function refreshIframe() {
// 	var ifr = document.getElementsByName('chile')[0];
// 	ifr.src = ifr.src;
// }
//



$(function() {
  $("#arcbook").dialog({
    dialogClass: 'dialogWithDropShadow',
    autoOpen: false,
    modal: true,
    show: {
      effect: "",
      duration: 500
    },
    hide: {
      effect: "",
      duration: 500
    },
    open: function(ev, ui) {
      $("#arcf").attr('src', "http://loosine.com/test.html");
      $('.ui-widget-overlay').addClass('custom-overlay');
    },

    close: function() {
      $('.ui-widget-overlay').removeClass('custom-overlay');
    },
    width: 1250,
    height: 600,
    draggable: true,
    resizable: true
  });

  $("#arcopener").click(function() {
    $("#arcbook").dialog("open");
  });
});

$(function() {
  $("#gisbook").dialog({
    dialogClass: 'dialogWithDropShadow',
    autoOpen: false,
    modal: true,
    show: {
      effect: "",
      duration: 500
    },
    hide: {
      effect: "",
      duration: 500
    },
    open: function(ev, ui) {
      $("#gisf").attr('src', "http://loosine.com/gis.html");
      $('.ui-widget-overlay').addClass('custom-overlay');
    },

    close: function() {
      $('.ui-widget-overlay').removeClass('custom-overlay');
    },
    width: 1250,
    height: 600,
    draggable: true,
    resizable: true
  });

  $("#gisopener").click(function() {
    $("#gisbook").dialog("open");
  });
});




$(document).ready(function() {

  $(".icon2").click(function() {
    $(".drop2").toggle("slow");
  });
  $(".built").click(function() {
    $(".drop").toggle("slow");
  });
  $(".more").click(function() {
    $(".drop2").toggle("slow");
  });

  $(".chile").click(function() {
    $("#chile_frame").attr('src', 'http://loosine.com/international/chilemigration.html').delay(800);
  });

});
