/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render", "renderControls"] }] */

class Visual {
  constructor(config, renderID = Visual.DEFAULT_RENDER_ID,
    renderControlsID = Visual.DEFAULT_RENDER_CONTROLS_ID) {
    this.renderID = renderID;
    this.renderControlsID = renderControlsID;
    this.dataSet = config.dataSet;
    this.data = [];
    this.attributes = config.attributes;
    this.type = config.type;
  }

  async fetchData() {
    const db = firebase.firestore();
    const data = [];
    await db.collection(`datasets/${this.dataSet}/entries`).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const entry = doc.data();
        entry.id = doc.id;
        data.push(entry);
      });
      this.data = data;
      this.onLoadData();
    })
    .catch((error) => {
      console.error(error);
    });
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
    const generateButton = document.createElement('button');
    generateButton.className = 'button';
    generateButton.innerText = 'Download Config';
    generateButton.addEventListener('click', () => this.generateConfig());

    const downloadContainer = document.getElementById(id);
    downloadContainer.appendChild(generateButton);
  }

  generateConfig() {
    const config = {
      type: this.type,
      dataSet: this.dataSet,
      attributes: this.attributes,
    };
    const downloadButton = document.createElement('a');
    downloadButton.className = 'button';
    downloadButton.innerText = 'Download Config';
    downloadButton.href = `data:text/json;charset=utf-8,${JSON.stringify(config)}`;
    downloadButton.download = 'config.json';
    downloadButton.click();
  }

  static empty(id) {
    document.getElementById(id).innerHTML = '';
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

  async fetchAndRender() {
    await this.fetchData();

    this.render();
    this.renderControls();
    this.generateConfigButton();
  }

  onLoadData() {} //eslint-disable-line

  renderControls() {
    throw new Error('You must implement this method');
  }

  render() {
    throw new Error('You must implement this method');
  }
  /**
  *Filters This.data and returns only numeric data columns
  */
  getNumericData() {
    const dataKeys = Object.keys(this.data[0]);
    const numericData = JSON.parse(JSON.stringify(this.data));
    for (let i = 0; i < dataKeys.length; i += 1) {
      const groupedList = this.getGroupedList(dataKeys[i]);
      if (groupedList.length <= (this.data.length * 0.75)
       && Number.isFinite(groupedList[dataKeys[i]][0])) {
        for (let j = 0; j < this.data.length; j += 1) {
          delete numericData[j][dataKeys[i]];
        }
      }
    }
    return numericData;
  }
  /**
  *Filters This.data and returns only categorical data columns
  */
  getCategoricalData() {
    const dataKeys = Object.keys(this.data[0]);
    const categoricalData = JSON.parse(JSON.stringify(this.data));
    for (let i = 0; i < dataKeys.length; i += 1) {
      const groupedList = this.getGroupedList(dataKeys[i]);
      if (groupedList.length > this.data.length * 0.75) {
        for (let j = 0; j < this.data.length; j += 1) {
          delete categoricalData[j][dataKeys[i]];
        }
      }
    }
    return categoricalData;
  }
  /**
  *Filters This.data and returns only identifying data columns
  */
  getIdData() {
    const dataKeys = Object.keys(this.data[0]);
    const categoricalData = JSON.parse(JSON.stringify(this.data));
    for (let i = 0; i < dataKeys.length; i += 1) {
      const groupedList = this.getGroupedList(dataKeys[i]);
      if (groupedList.length <= (this.data.size * 0.75)
      && !Number.isFinite(groupedList[dataKeys[i]][0])) {
        for (let j = 0; j < this.data.length; j += 1) {
          delete categoricalData[j][dataKeys[i]];
        }
      }
    }
    return categoricalData;
  }
}

Visual.DEFAULT_RENDER_ID = 'visual';
Visual.DEFAULT_RENDER_CONTROLS_ID = 'controls';

export default Visual;
