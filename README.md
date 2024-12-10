# National Rail Lovelace Card
Custom card for https://github.com/plutomedia987/homeassistant_nationalrail/

![image](https://github.com/user-attachments/assets/bc48d290-73b0-4fab-ae8c-b78946434cd0)

Clicking on the depature board shows the train location

![image](https://github.com/user-attachments/assets/03143d7d-2179-4d9c-b235-f2894bfdaaeb)

# Installation
## HACS (Easiest)
Add this as a custom reposity in to HACS

[Add to HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=plutomedia987&repository=lovelace-nationalrail&category=dashboard)

## Setup
The card should be configurable in the GUI

# YAML Configuration

```yaml
type: custom:national-rail-card
arr_nDep: false
entity: sensor.train_schedule_lut_stp
station: STP
numRows: 5
grid_options:
  columns: 12
  rows: auto
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| type      | custom:national-rail-card | The type of card to use. This must eb this value |
| arr_nDep  | true<br>false   | Show arrivals to station from destination<br>Show departures from station to destination   |
| entity    | sensor  | The national Rail sensor to pull the data from  |
| numRows   | 1-10 | The number of rows to display |
