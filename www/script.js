
let $ = document.querySelector.bind(document);

let weights = [
  { date: new Date(2020, 10, 27), weight: 96.8 },
  { date: new Date(2020, 10, 28), weight: 95.4 },
  { date: new Date(2020, 10, 29), weight: 95.4 },
  { date: new Date(2020, 10, 30), weight: 95.2 },
  { date: new Date(2020, 11, 1),  weight: 95.4 },
  { date: new Date(2020, 11, 2),  weight: 96.2 },
  { date: new Date(2020, 11, 3),  weight: 95.4 }
];

let activities = [
  {
    date: new Date(2020, 11, 1),
    activities: [
      { id: 'run', distance: 10000, duration: 3645 }
    ]
  },
  {
    date: new Date(2020, 11, 2),
    activities: [
      { id: '7min-monthly-challenge', duration: 385 }
    ]
  },
  {
    date: new Date(2020, 11, 3),
    activities: [
      { id: 'run', distance: 15000, duration: 5513 }
    ]
  },
];

Chart.defaults.global.defaultFontFamily = "Rubik";
Chart.defaults.global.defaultFontColor = "#BBB";
Chart.defaults.global.defaultFontSize = 15;

function roundTo(x, to) {
  return Math.round(x / to) * to;
}

function drawWeight(data) {
  let weights = data.map(e => e.weight);
  new Chart($("#weight canvas").getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        data: data.map(o => { return { x: o.date, y: o.weight }}),
        borderColor: ["rgba(255, 159, 64, 1)"],
        borderWidth: 4,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      aspectRatio: 1.25,
      legend: { display: false },
      scales: {
        yAxes: [{
          position: 'right',
          gridLines: {
            drawBorder: false,
          },
          ticks: {
            min: roundTo(Math.min.apply(Math, weights) - 10, 5),
            max: roundTo(Math.max.apply(Math, weights) + 10, 5),
            stepSize: 5,
            padding: 10
          }
        }],
        xAxes: [{
          type: "time",
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
          },
          time: {
            distribution: "linear",
            unit: "day",
            displayFormats: {
              day: 'D',
          },
          },
          gridLines: {
            drawBorder: false,
            display: false,
          },
        }]
      }
    }
  });
}

let datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

function setDay(date, dayOfWeek) {
  date = new Date(date.getTime());
  date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
  return date;
}

function daysSince(first, second) {
  return Math.round(Math.abs((first - second) / (1000 * 60 * 60 * 24)));
}

function drawActivity(activities) {

  let fragment = document.createDocumentFragment();
  for (let day = 0; day < 21; day++) {
    fragment.appendChild(document.createElement("div"));
  }

  // The last day (Saturday) of the current week, this is the last
  // day to be displayed in the activity UI
  let lastDay = setDay(new Date(), 6);
  activities.forEach(activity => {
    let days = daysSince(activity.date, lastDay);
    fragment.childNodes[21 - days].classList.add("busy");
  });

  $("#activity-content").appendChild(fragment);
}

let render = {
  run: (data) => `${distance(data.distance)} Run in ${length(data.duration)}`,
  "7min-monthly-challenge": (data) => `${length(data.duration)} Home workout`
}

function distance(distance) {
  if (distance > 1000) {
    return distance / 1000 + "KM";
  }
  return distance + "M"
}

function length(time) {
  let h = Math.floor(time / (60 * 60));
  time -= h * (60 * 60);
  let m = Math.floor(time / 60);

  if (h && m) {
    return `${h}h ${m}m`;
  } else if (h) {
    return `${h}h`;
  }
  time -= m * 60;
  return `${m}m ${time}s`;
}

function parseHTML(html) {
  var t = document.createElement('template');
  t.innerHTML = html;
  return t.content.cloneNode(true);
}

function drawRecentActivities(recentActivities)  {
  recentActivities.sort((a, b) => b.date - a.date);
  recentActivities.map(({date, activities}) => {
    let fragment = parseHTML(`<div class="activity">
      <div class="date">
        <h3>${date.toLocaleString("default", { month: 'short' })}</h3>
        <h2>${date.toLocaleString("default", { day: '2-digit' })}</h2>
      </div>
    </div>`);
    if (activities.length === 1) {
      let activity = activities[0];
      console.log(activity);
      fragment.firstChild.insertAdjacentHTML(
        "beforeend",
        `<div class="content">${render[activity.id](activity)}</div>`
      );
    }
    $("#recent-activities").appendChild(fragment);
  });
}

drawWeight(weights);
drawActivity(activities);
drawRecentActivities(activities);