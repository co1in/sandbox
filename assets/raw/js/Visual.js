/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render", "renderControls"] }] */

class Visual {

  constructor(config) {
    this.data = Visual.fetchData(config.dataSet);
    this.attributes = config.attributes;
  }

  static fetchData(dataName) {
    return [{ id: 1, color: 'pink' },
            { id: 2, color: 'pink' },
            { id: 3, color: 'green' },
            { id: 4, color: 'green' },
            { id: 5, color: 'red' },
            { id: 6, color: 'red' },
            { id: 7, color: 'red' },
            { id: 8, color: 'red' },
            { id: 9, color: 'blue' },
            { id: 10, color: 'blue' },
            { id: 11, color: 'blue' },
            { id: 12, color: 'blue' },
            { id: 13, color: 'blue' },
            { id: 14, color: 'blue' },
            { id: 15, color: 'blue' }];
  }

  generateCategoryCountArray(columnName) {
    const results = [];
    for (let i = 0; i < this.data.length; i += 1) {
      const categoryVal = this.data[i][columnName];

      let found = false;
      for (let p = 0; p < results.length; p += 1) {
        if (results[p].key === categoryVal) {
          results[p].value += 1;
          found = true;
          break;
        }
      }

      if (!found) {
        results.push({ key: categoryVal, value: 1 });
      }
    }

    return results;
  }

  generateConfig() {
    const downloadButton = document.createElement('a');
    downloadButton.className = 'download-button';
    downloadButton.value = 'Download Config';
    downloadButton.href = `data:application/octet-stream,${JSON.stringify(this.attributes)}`;

    const downloadContainer = document.getElementById('download');
    downloadContainer.appendChild(downloadButton);
  }

  renderControls(id) {
    throw new Error('You must implement this method');
  }

  render(id) {
    throw new Error('You must implement this method');
  }
}

Visual.DEFAULT_RENDER_ID = 'visual';
Visual.DEFAULT_RENDER_CONTROLS_ID = 'controls';

export default Visual;
