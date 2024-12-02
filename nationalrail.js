import {
  LitElement,
  html,
  css,
  svg,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

const locale = {
  "en": {
    "entity": "Entity",
    "numRows": "Number of Rows",
    "arr_nDep": "Arrival/Depature Board",
    "arr_val": "Arrival",
    "dept_val": "Departure",
    "origin": "Origin",
    "destination": "Destination",
    "platform": "Platform",
    "departure": "Departure",
    "arrival": "Arrival",
    "operator": "Operator",
    "expected": "Expected",
    "actual": "Actual",
    "scheduled": "Scheduled",
    "estimated": "Estimated",
    "on_time": "On Time",
    "cancelled": "Cancelled",
    "arr_from": "Arrivals From",
    "dept_to": "Departures To",
    "station": "Station",
    "duration": "Duration",
  }
}

const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

function hasConfigOrEntityChanged(element, changedProps) {
  if (changedProps.has("_config")) {
    return true;
  }

  const oldHass = changedProps.get("hass");
  if (oldHass) {
    return (
      oldHass.states[element._config.entity] !==
      element.hass.states[element._config.entity]
    );
  }

  return true;
}

class NationalRailCard extends LitElement {

  trainSize = new Object({
    "xstart": 2,
    "trainWidth": 25,
    "trainHeight": 14,
    "ystart": 2,
    "cabWidth": 8
  });

  static get properties() {
    return {
      hass: { type: Object},
      _config: { type: Object },
    };
  }

  static getConfigElement() {
    return document.createElement("national-rail-card-editor");
  }

  static getStubConfig(hass, entities, entitiesFallback) {
    const entity = Object.keys(hass.states).find((eid) =>
      Object.keys(hass.states[eid].attributes).some(
        (aid) => aid == "attribution"
      )
    );

    // console.log(entity);

    // const stations = Object.keys(entity.attributes.dests);

    return {
      entity: entity,
      numRows: 5,
      arr_nDep: false,
      // station: stations[0],
     };
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    this._config = config;
    // console.log(config)
  }

  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns in masonry view
  getCardSize() {
    return 4;
  }

  // The rules for sizing your card in the grid in sections view
  // getLayoutOptions() {
  //   return {
  //     grid_rows: 3,
  //     grid_columns: 4,
  //     grid_min_rows: 3,
  //     grid_max_rows: 3,
  //   };
  // }

  _ll(str) {
    if (locale[this.lang] === undefined) {
      if (Object.keys(locale.en).includes(str)) {
        return locale.en[str];
      } else {
        return str;
      }
    } else {
      return locale[this.lang][str];
    }
  }

  static get styles() {
    return css`
      hr {
        border-color: var(--divider-color);
        border-bottom: none;
        margin: 16px 0;
      }

      .nr-label{
        font-weight: bold;
        white-space: nowrap;
      }

      .nr-header-direction{
        font-size: medium;
        vertical-align: middle;
        font-style: italic;
        color: var(--ha-card-header-color,var(--secondary-text-color))
      }

      .nr-orig{
        width: 99%
      }

      .nr-cancelled-colour{
        font-weight: bold;
        color: red;
      }

      .nr-other-colour{
        color: orange;
        font-weight: bold;
      }

      .nr-expected-time{
        color: aqua;
        font-weight: bold;
      }

      .nr-override-time{
        text-decoration: line-through;
      }

      .nr-schedule{
        display: block;
      }

      .nr-train-schedule{
        display: flex;
        justify-content: center;
      }

      .nr-train-bar{
        width: 5%;
        border: 1px solid var(--primary-text-color);
        border-radius: 50vh
      }

      .nr-train-stations{
        flex-grow: 0.8
      }

      .nr-train-station-name{
        padding: 0.75em;
      }

      .nr-train-bar-progress{
        background-color: green;
        border-radius: 50vh;
        display: flex;
      }

      .nr-train-bar-progress-cancelled{
        background-color: red;
        border-radius: 50vh;
      }

      .nr-train-bar-progress-circle{
        flex: 1;
        border: 1px solid;
        height: 2.5vh;
        border-radius: 50vh;
        align-self: flex-end;
        background-color: darkgreen;
      }

      .nr-table {
        display: table;
        cursor: pointer;
      }

      .nr-table-row{
        display: table-row;
      }

      .nr-table-cell{
        display: table-cell;
        padding-left: 2px;
        padding-right: 2px;
      }

      .nr-table-cell-train{
        column-span: 2;
      }

      .nr-close-btn{
        text-align: center;
        border: 1px solid var(--primary-text-color);
        padding: 0.5em;
        margin: 0.5em;
        border-radius: 50vh;
        cursor: pointer;
      }

      .nr-close-btn:hover{
        color: var(--secondary-text-color);
        border-color: var(--secondary-text-color);
      }

      .nr-schedule-time{
        font-style: italic;
      }

      .nr-train-canvas{
        height: 16px;
        align-self: center;
        margin-top: 5px;
      }

      .nr-train-canvas path{
        stroke: var(--primary-text-color);
        /*fill: none;*/
      }

      .nr-train-cab{
        fill: var(--primary-text-color);
      }

      .nr-train-canvas text{
        fill: var(--primary-text-color);
      }

      .nr-train-board{
        display: flex;
        flex-direction: column;
      }

      .hide{
        display: none;
      }
    `;
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    // console.log(this.hass)

    if (Object.keys(this.hass.states).includes(this._config.entity)) {
      this.entityObj = this.hass.states[this._config.entity];
      if (Object.keys(this.entityObj).includes("attributes") && Object.keys(this.entityObj.attributes).includes("dests")) {
        this.stateAttr = this.entityObj["attributes"];

        return html`
          <ha-card>
            <h1 class="card-header">
              ${this.stateAttr.station}
              <span class="nr-header-direction">
                ${(this._config.arr_nDep ? this._ll("arr_from") : this._ll("dept_to"))}
              </span>
              ${this.stateAttr.dests[this._config.station].displayName}
            </h1>
            <div class="card-content">
              <div class="nr-train-board">
                ${this.renderRows()}
              </div>
              <div class="nr-schedule hide">
                <div class="nr-close-btn" @click="${this._handleCloseClick}">Close</div>
                ${this.renderSchedule()}
              </div>
            </div>
          </ha-card>
        `;
      } else {
        return html`
          <ha-card>
            <h1 class="card-header"></h1>
            <div class="card-content">
              Not a national rail entity
            </div>
          </ha-card>
        `;
      }
    } else {
      return html`
        <ha-card>
          <h1 class="card-header"></h1>
          <div class="card-content">
            Select Entity
          </div>
        </ha-card>
      `;
    }

  }

  _handleCloseClick(e) {

    e.stopPropagation();
    let components = e.composedPath();
    let targetElement = components[0];
    let boardElement = targetElement.closest(".card-content");
    let trainBoardElement = boardElement.querySelector(".nr-train-board");
    let scheduleElement = boardElement.querySelector(".nr-schedule");
    let scheduleRowElements = scheduleElement.querySelectorAll(".nr-train-schedule");

    trainBoardElement.classList.remove("hide");
    scheduleElement.classList.add("hide");

    for (let i = 0; i < scheduleRowElements.length; i++){
      if (!scheduleRowElements[i].classList.contains("hide")) {
        scheduleRowElements[i].classList.add("hide");
      }
    }
  }

  _handleRowClick(e) {

    e.stopPropagation();

    let components = e.composedPath();
    let targetElement = components[0];
    let trainBoardElement = targetElement.closest(".nr-train-board");
    let boardElement = trainBoardElement.closest(".card-content");
    let scheduleElement = boardElement.querySelector(".nr-schedule");

    let trainBoardRow = DOMTokenList;

    if (targetElement.classList.contains("nr-table")) {
      trainBoardRow = targetElement;
    } else {
      trainBoardRow = targetElement.closest(".nr-table");
    }

    let rowId = trainBoardRow.getAttribute("data-rowId");

    trainBoardElement.classList.add("hide");
    scheduleElement.classList.remove("hide");
    scheduleElement.querySelector(".nr-train-schedule-"+rowId).classList.remove("hide")

  }

  renderSchedule() {

    let rows = [];
    let trains = this.stateAttr.dests[this._config.station][(this._config.arr_nDep ? "Arrival" : "Departure")].trains

    for (let i = 0; i < ((trains.length > this._config.numRows)?this._config.numRows:trains.length); i++){
      rows.push(this.renderScheduleRows(trains[i],i));
    }

    return html`${rows}`;
  }

  renderScheduleRows(train, i) {

    let trainStation = [];

    let position = -0.5;
    let arrCount = 0;
    let positionCancelled = -0.5

    train.callingPoints.forEach(x => {

      if (!!x.at) {
        position = arrCount;
      }

      if (!!x.et && x.et == "Cancelled") {
        positionCancelled = arrCount;
      }

      arrCount++;

      let tval = x.et;
      if (x.et === null) {
        tval = x.at;
      }

      trainStation.push(html`
        <div class="nr-train-station-name">
          <span class="nr-schedule-time ${(!!tval && tval == "Cancelled") ? "nr-override-time" : ""}">
            ${this.getTime(x.st,tval,false).elements}
          </span>
          <span class="${(!!x.et && x.et == "Cancelled") ? "nr-override-time" : ""}">
            ${x.locationName}
          </span>
          &nbsp;
          <span class="nr-cancelled-colour">
            ${(!!x.et && x.et == "Cancelled") ? this._ll(x.et) : ""}
          </span>
        </div>
      `);
    });

    let trainProgress = (100 / trainStation.length) * ((position != 0) ? position + 1 : 0.5);
    let trainProgressCancelled = (100 / trainStation.length) * ((positionCancelled != 0) ? positionCancelled + 1 : 0.5);

    return html`
      <div class="nr-train-schedule nr-train-schedule-${i} hide">
        <!-- <ha-icon icon="mdi:close"></ha-icon> -->
        <div class="nr-train-bar">
          <!--<div class="nr-train-bar-progress-cancelled" style="height:${trainProgressCancelled}%"></div>-->
          <div class="nr-train-bar-progress" style="height:${trainProgress}%">
            <div class="nr-train-bar-progress-circle"></div>
          </div>
        </div>
        <div class="nr-train-stations">
          ${trainStation}
        </div>
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    let canvases = this.shadowRoot.querySelectorAll(".nr-train-canvas");

    canvases.forEach(x => {
      // console.log(x.getBBox())
    });
  }

  drawTrain(length) {

    let trainElements = [];
    let start = this.trainSize.xstart;
    let trainWidth = this.trainSize.trainWidth;
    let trainHeight = this.trainSize.trainHeight;
    let y = this.trainSize.ystart;
    let cabWidth = this.trainSize.cabWidth;

    trainElements.push(svg`
      <path d="M${start+cabWidth} ${y} V${y+trainHeight} H${start} L${start+cabWidth} ${y}" class="nr-train-cab" />
    `);

    start = start + cabWidth;

    for (let i = 0; i < length; i++) {
      trainElements.push(svg`
        <path d="M${start} ${y} H${start + trainWidth} V${y + trainHeight} H${start} V${y}" />
        <text x="${start + trainWidth/2}" y="${y + trainHeight/2 + 0.5}" dominant-baseline="middle" text-anchor="middle">${i}</text>
      `)

      start = start + trainWidth;
    }

    return trainElements;
  }

  renderRows() {

    let rows = [];
    let trains = this.stateAttr.dests[this._config.station][(this._config.arr_nDep ? "Arrival" : "Departure")].trains

    for (let i = 0; i < ((trains.length > this._config.numRows)?this._config.numRows:trains.length); i++){

      rows.push(this.createRow(this._config.arr_nDep,trains[i],i));
      rows.push(html`<hr />`);
    }
    rows.pop();

    return html`${rows}`;
  }

  createRow(arr_nDep, rowInfo, rowId) {

    let plat = html`
      <div class="nr-table-row">
        <div class="nr-table-cell nr-label">${this._ll("platform")}: </div>
        <div class="nr-table-cell nr-plat">${(rowInfo.platform ? rowInfo.platform : "N/A")}</div>
      </div>
    `;

    let canvas = html``;
    if (rowInfo["length"] !== null && rowInfo["length"] > 0) {
      canvas = html`
        <svg class="nr-train-canvas" xmlns="http://www.w3.org/2000/svg" width="${this.trainSize.cabWidth + this.trainSize.xstart + (this.trainSize.trainWidth * rowInfo["length"]) + 1}">
          ${this.drawTrain(rowInfo["length"])}
        </svg>
      `;
    }

    let platBefore = html``;
    let platAfter = html``;
    let departTime = html``;
    let arrivalTime = html``;
    if (arr_nDep === true) {
      platAfter = plat;
      departTime = this.getTime(rowInfo.otherEnd.st, rowInfo.otherEnd.atet);
      arrivalTime = this.getTime(rowInfo.scheduled, rowInfo.expected);
    } else {
      platBefore = plat;
      departTime = this.getTime(rowInfo.scheduled, rowInfo.expected);
      arrivalTime = this.getTime(rowInfo.otherEnd.st, rowInfo.otherEnd.et);
    }

    let trainDuration = html`<span class="nr-other-colour">N/A</span>`;
    if ((departTime.timeRet instanceof Date) && (arrivalTime.timeRet instanceof Date)) {

      let dur = (arrivalTime.timeRet - departTime.timeRet)/1000;
      dur = Math.floor(dur / 60);

      if (dur > 60) {
        let hours = Math.floor(dur / 60);
        let minutes = Math.floor(dur - (hours * 60))
        trainDuration = hours + " Hour(s) " + minutes + " Minutes(s)"
      } else {
        trainDuration = dur + " Minute(s)";
      }
    }

    return html`
      <div class="nr-table" data-rowId="${rowId}" @click="${this._handleRowClick}">
        <div class="nr-table-row">
          <div class="nr-table-cell nr-label">${this._ll("origin")}: </div>
          <div class="nr-table-cell nr-orig">${rowInfo.origin}</div>
        </div>
        <div class="nr-table-row">
          <div class="nr-table-cell nr-label">${this._ll("destination")}: </div>
          <div class="nr-table-cell nr-dest">${rowInfo.destination}</div>
        </div>
        <div class="nr-table-row">
          <div class="nr-table-cell nr-label">${this._ll("departure")}: </div>
          <div class="nr-table-cell nr-depart">${departTime.elements}</div>
        </div>
        ${platBefore}
        <div class="nr-table-row">
          <div class="nr-table-cell nr-label">${this._ll("arrival")}: </div>
          <div class="nr-table-cell nr-ariv">${arrivalTime.elements}</div>
        </div>
        ${platAfter}
        <div class="nr-table-row">
          <div class="nr-table-cell nr-label">${this._ll("duration")}: </div>
          <div class="nr-table-cell nr-ariv">${trainDuration}</div>
        </div>
        <div class="nr-table-row">
          <div class="nr-table-cell nr-label">${this._ll("operator")}: </div>
          <div class="nr-table-cell nr-oper">${rowInfo.operator}</div>
        </div>
      </div>
      ${canvas}
    `;
  }

  addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

  // timeDiff(time1, time2) {

  //   // const time1_date = new Date(Date.parse(time1));
  //   // const time2_date = new Date(Date.parse(time2));

  //   // console.log(time1_date);
  //   // console.log(time2_date);

  //   if ((time1 instanceof Date) && (time2 instanceof Date)) {
  //     return time2 - time1;
  //   }

  //   return "Error";
  // }

  getTime(scheduled_in, expected_in, return_cancelled=true) {

    const scheduled = new Date(Date.parse(scheduled_in));
    const expected = new Date(Date.parse(expected_in));

    let timeRet = null;

    if (isNaN(scheduled)) {
      if (scheduled_in == "cancelled") {
        if (return_cancelled) {
          return {
            "timeRet": null,
            "elements": html`
              <span class="nr-cancelled-colour">
                ${this._ll("cancelled")}
              </span>
            `
          }
        }
      } else {
        return {
          "timeRet": scheduled_in,
          "elements": html`
            <span class="nr-other-colour">
              ${this._ll(scheduled_in)}
            </span>
          `
        }
      }
    } else {
      timeRet = null;

      if (expected_in != scheduled_in) {
        let elements = [];
        elements.push(html`
          <span class="nr-override-time">
            ${this.addZero(scheduled.getHours())}:${this.addZero(scheduled.getMinutes())}
          </span>&nbsp;
        `);

        if (!isNaN(expected)) {

          timeRet = expected;
          elements.push(html`
            <span class="nr-expected-time">
              Expected: ${this.addZero(expected.getHours())}:${this.addZero(expected.getMinutes())}
            </span>
          `);
        } else {

          timeRet = null;

          if (expected_in == "Cancelled") {

            timeRet = null;

            if (return_cancelled) {

              elements.push(html`
                <span class="nr-cancelled-colour">
                  ${this._ll("cancelled")}
                </span>
              `);

            }
          } else {

            timeRet = expected;

            elements.push(html`
              <span class="nr-other-colour">
                ${this._ll(expected_in)}
              </span>
            `);
          }
        }

        return { "elements": elements, "timeRet": timeRet };

      } else {
        return {
          "timeRet": scheduled,
          "elements": html`
            <span>
              ${this.addZero(scheduled.getHours())}:${this.addZero(scheduled.getMinutes())}
            </span>
          `
        }
      }
    }
  }
}


class NationalRailCardEditor extends LitElement {

  static get properties() {
    return {
      hass: { type: Object},
      _config: { type: Object },
    };
  }

  setConfig(config) {
    this._config = config;
  }

  _valueChanged(ev) {
    const config = ev.detail.value;
    fireEvent(this, "config-changed", { config });
  }

  _computeLabelCallback = (schema) => {
    if (this.hass) {
      switch (schema.name) {
        case "title":
          return this.hass.localize(
            `ui.panel.lovelace.editor.card.generic.title`
          );
        case "entity":
          return `${this.hass.localize(
            "ui.panel.lovelace.editor.card.generic.entity"
          )} (${this.hass.localize(
            "ui.panel.lovelace.editor.card.config.required"
          )})`;
        default:
          return this._ll(schema.name);
      }
    } else {
      return "";
    }
  };

  _ll(str) {
    if (locale[this.lang] === undefined) return locale.en[str];
    return locale[this.lang][str];
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    this.lang = this.hass.selectedLanguage || this.hass.language;

    let stations = [];

    if (Object.keys(this.hass.states).includes(this._config.entity)) {
      this.entityObj = this.hass.states[this._config.entity];

      if (Object.keys(this.entityObj).includes("attributes")) {
        this.stateAttr = this.entityObj["attributes"];

        if (Object.keys(this.stateAttr).includes("dests")) {

          for (const [crs, station] of Object.entries(this.stateAttr["dests"])) {
            stations.push({
              label: station["displayName"],
              value: crs
            })
          }
        }
      }
    }

    const schema = [
      {
        name: "entity",
        required: true,
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "numRows",
        required: true,
        selector: { number: {mode:"box", min: 1, max: 10} },
      },
      {
        name: "arr_nDep",
        required: true,
        selector: {
          select: {
            options:[{
              label: this._ll("arr_val"),
              value: true
            }, {
              label: this._ll("dept_val"),
              value: false
            }]
          }
        }
      },
      {
        name: "station",
        required: true,
        selector: {
          select: {
            options: stations
          }
        }
      }
    ];

    const data = {
      ...this._config,
    };

    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${this._computeLabelCallback}
      @value-changed=${this._valueChanged}
    ></ha-form>`;
  }

}

customElements.define("national-rail-card", NationalRailCard);
customElements.define("national-rail-card-editor", NationalRailCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "national-rail-card",
  name: "National Rail Card",
  preview: true, // Optional - defaults to false
  description: "Show National Rail train schedules", // Optional
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card", // Adds a help link in the frontend card editor
});