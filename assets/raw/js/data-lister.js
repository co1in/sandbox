const datasets = [
  { name: 'Ponti', description: 'Blah Blah Blah', link: '#ponti' },
  { name: 'Rive', description: 'Blah Blah Blah', link: '#rive' },
];

for (let i = 0; i < datasets.length; i += 1) {
  const row = document.createElement('div');
  row.className = 'data-row';
  const link = document.createElement('a');
  link.href = datasets[i].link;
  const name = document.createElement('div');
  name.className = 'name';
  name.innerHTML = datasets[i].name;
  const description = document.createElement('div');
  description.className = 'description';
  description.innerHTML = datasets[i].description;
  link.appendChild(name);
  link.appendChild(description);
  row.appendChild(link);
  document.querySelector('.body').appendChild(row);
}
