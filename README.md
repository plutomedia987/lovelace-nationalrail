# National Rail Lovelace Card
Custom card for https://github.com/plutomedia987/homeassistant_nationalrail/

Clicking on the depature board shows the train location


# Installation
## HACS (Easiest)
Add this as a custom reposity in to HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=plutomedia987&repository=lovelace-nationalrail&category=Dashboard)

## Setup
The card should be configurable in the GUI

# YAML Configuration

```yaml
type: custom:national-rail-card
entity: sensor.train_schedule_lut_stp
numRows: 5
grid_options:
  columns: 12
  rows: auto
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| type      | custom:national-rail-card | The type of card to use. This must eb this value |
| entity    | sensor  | The national Rail sensor to pull the data from  |
| numRows   | 1-10 | The number of rows to display |
