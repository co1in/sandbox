/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render", "renderControls"] }] */

class Visual {

  constructor(config, renderID = Visual.DEFAULT_RENDER_ID,
    renderControlsID = Visual.DEFAULT_RENDER_CONTROLS_ID) {
    this.renderID = renderID;
    this.renderControlsID = renderControlsID;
    this.data = Visual.fetchData(config.dataSet);
    this.attributes = config.attributes;
  }

  static fetchData(dataName) {
    return [{ id: 1, color: 'pink', height: 10, lat: 45.43, lng: 12.33, year: 1934 },
            { id: 2, color: 'pink', height: 10, lat: 0, lng: 0, year: 1944 },
            { id: 3, color: 'green', height: 10, lat: 0, lng: 0, year: 1954 },
            { id: 4, color: 'green', height: 10, lat: 0, lng: 0, year: 1964 },
            { id: 5, color: 'red', height: 10, lat: 0, lng: 0, year: 1974 },
            { id: 6, color: 'red', height: 10, lat: 0, lng: 0, year: 1984 },
            { id: 7, color: 'red', height: 10, lat: 0, lng: 0, year: 1994 },
            { id: 8, color: 'red', height: 10, lat: 0, lng: 0, year: 1924 },
            { id: 9, color: 'blue', height: 10, lat: 0, lng: 0, year: 1914 },
            { id: 10, color: 'blue', height: 10, lat: 0, lng: 0, year: 1904 },
            { id: 11, color: 'blue', height: 10, lat: 0, lng: 0, year: 1934 },
            { id: 12, color: 'blue', height: 10, lat: 0, lng: 0, year: 1934 },
            { id: 13, color: 'blue', height: 10, lat: 0, lng: 0, year: 1934 },
            { id: 14, color: 'blue', height: 10, lat: 0, lng: 0, year: 1934 },
            { id: 15, color: 'blue', height: 10, lat: 0, lng: 0, year: 1934 }];
  }

  getGroupedList(columnName) {
    const results = [];
    for (let i = 0; i < this.data.length; i += 1) {
      const categoryVal = this.data[i][columnName];

      let found = false;
      for (let p = 0; p < results.length; p += 1) {
        if (results[p].key === categoryVal) {
          results[p].value.push(this.data[i]);
          found = true;
          break;
        }
      }

      if (!found) {
        results.push({ key: categoryVal, value: [this.data[i]] });
      }
    }

    return results;
  }

  getGroupedListCounts(columnName) {
    const data = this.getGroupedList(columnName);
    const results = [];
    for (let i = 0; i < data.length; i += 1) {
      results.push({ key: data[i].key, value: data[i].value.length });
    }
    return results;
  }

  generateConfigButton(id = 'download') {
    const downloadButton = document.createElement('a');
    downloadButton.className = 'download-button';
    downloadButton.innerText = 'Download Config';
    downloadButton.href = `data:text/json;charset=utf-8,${JSON.stringify(this.attributes)}`;
    downloadButton.download = 'config.json';

    const downloadContainer = document.getElementById(id);
    downloadContainer.appendChild(downloadButton);
  }

  empty() {
    document.getElementById(this.renderID).innerHTML = '';
  }

  applyDefaultAttributes(defaults) {
    const keys = Object.keys(defaults);
    for (let i = 0; i < keys.length; i += 1) {
      if (defaults.hasOwnProperty(keys[i])) {
        if (!this.attributes.hasOwnProperty(keys[i])) {
          this.attributes[keys[i]] = defaults[keys[i]];
        }
      }
    }
  }

  renderControls() {
    throw new Error('You must implement this method');
  }

  render() {
    throw new Error('You must implement this method');
  }
}

Visual.DEFAULT_RENDER_ID = 'visual';
Visual.DEFAULT_RENDER_CONTROLS_ID = 'controls';

export default Visual;
