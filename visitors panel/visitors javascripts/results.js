document.addEventListener('DOMContentLoaded', () => {
  const blurPrivateDetails = () => {
    document.querySelectorAll('.private-detail').forEach(detailBox => {
      detailBox.classList.add('is-blurred');
    });
  };

  const protectPage = () => {
    const blockedKeys = ['c', 'x', 's', 'p', 'u'];

    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('copy', event => event.preventDefault());
    document.addEventListener('cut', event => event.preventDefault());
    document.addEventListener('dragstart', event => event.preventDefault());
    document.addEventListener('selectstart', event => {
      if (!event.target.closest('input, textarea, select')) {
        event.preventDefault();
      }
    });
    document.addEventListener('keydown', event => {
      const key = event.key.toLowerCase();
      const isShortcut = event.ctrlKey || event.metaKey;

      if ((isShortcut && blockedKeys.includes(key)) || event.key === 'PrintScreen') {
        event.preventDefault();
        blurPrivateDetails();
      }
    });
  };

  protectPage();

  // 1. Grab the URL parameters sent by the index.html form
  const params = new URLSearchParams(window.location.search);
  const firstName = params.get('firstName') || '';
  const lastName = params.get('lastName') || '';
  
  // Combine names, trim extra spaces, and handle empty search
  let searchName = [firstName, lastName].join(' ').trim();
  if (!searchName) {
    searchName = "Unknown";
  }

  // 2. Display who we are searching for
  const queryDisplay = document.getElementById('search-query-display');
  queryDisplay.replaceChildren(
    document.createTextNode('Showing results for: '),
    Object.assign(document.createElement('strong'), { textContent: searchName })
  );

  // 3. Setup dummy data for demonstration
  // (In a real application, you would make an API call to a database here based on 'searchName')
  const dummyData = [
    { name: firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Maria Santos', born: 'January 15, 1945', died: 'December 12, 2020', location: 'Section D, Plot 12' },
    { name: 'Sol Martinez Alvarez', born: 'March 10, 1955', died: 'July 22, 2021', location: 'Section B, Plot 14' },
    { name: 'Sol Martinez Bautista', born: 'August 24, 1960', died: 'November 5, 2019', location: 'Section C, Plot 8' },
    { name: 'Sol Martinez Cruz', born: 'December 5, 1948', died: 'January 18, 2015', location: 'Section A, Plot 22' },
    { name: 'Juan Manuel Dela Cruz', born: 'February 20, 1950', died: 'November 1, 2018', location: 'Section A, Plot 8' },
    { name: 'Elena Rosales Villanueva', born: 'March 8, 1938', died: 'June 15, 2015', location: 'Section B, Plot 24' },
    { name: 'Roberto Garcia Reyes', born: 'April 12, 1960', died: 'August 22, 2021', location: 'Section C, Plot 5' },
    { name: 'Carmen Mendoza Flores', born: 'May 30, 1942', died: 'September 10, 2019', location: 'Section D, Plot 18' },
    { name: 'Ricardo Castro Cruz', born: 'June 25, 1955', died: 'July 4, 2022', location: 'Section E, Plot 33' },
    { name: 'Teresita Bautista Perez', born: 'July 18, 1948', died: 'October 31, 2017', location: 'Section F, Plot 11' },
    { name: 'Eduardo Navarro Gomez', born: 'August 5, 1935', died: 'January 14, 2010', location: 'Section G, Plot 42' },
    { name: 'Josefina Ramos Ramos', born: 'September 14, 1952', died: 'March 8, 2020', location: 'Section H, Plot 7' },
    { name: 'Antonio Diaz Aquino', born: 'October 2, 1940', died: 'December 25, 2016', location: 'Section I, Plot 19' },
    { name: 'Lourdes Tolentino Cortez', born: 'November 22, 1947', died: 'February 18, 2014', location: 'Section J, Plot 2' },
    { name: 'Fernando De Leon Santos', born: 'December 9, 1965', died: 'April 5, 2023', location: 'Section A, Plot 55' },
    { name: 'Rosa Alonzo Mercado', born: 'January 3, 1930', died: 'May 20, 2008', location: 'Section B, Plot 14' },
    { name: 'Manuel Gonzales Cruz', born: 'February 17, 1958', died: 'June 30, 2019', location: 'Section C, Plot 27' },
    { name: 'Leticia Rivera Reyes', born: 'March 21, 1944', died: 'August 12, 2015', location: 'Section D, Plot 9' },
    { name: 'Jose Santos Fernandez', born: 'April 8, 1939', died: 'September 28, 2012', location: 'Section E, Plot 41' },
    { name: 'Gloria Cruz Bautista', born: 'May 11, 1951', died: 'November 15, 2020', location: 'Section F, Plot 6' },
    { name: 'Mario Reyes Mendoza', born: 'June 16, 1962', died: 'January 7, 2021', location: 'Section G, Plot 30' },
    { name: 'Beatriz Perez Garcia', born: 'July 29, 1936', died: 'March 22, 2011', location: 'Section H, Plot 15' },
    { name: 'Arturo Gomez Navarro', born: 'August 14, 1949', died: 'October 9, 2018', location: 'Section I, Plot 22' },
    { name: 'Virginia Ramos Diaz', born: 'September 7, 1941', died: 'December 3, 2014', location: 'Section J, Plot 8' },
    { name: 'Luis Aquino Tolentino', born: 'October 25, 1956', died: 'February 11, 2022', location: 'Section A, Plot 60' },
    { name: 'Nida Cortez De Leon', born: 'November 4, 1945', died: 'May 17, 2016', location: 'Section B, Plot 3' },
    { name: 'Ramon Mercado Alonzo', born: 'December 19, 1938', died: 'July 24, 2009', location: 'Section C, Plot 38' },
    { name: 'Flora Cruz Gonzales', born: 'January 28, 1953', died: 'August 5, 2019', location: 'Section D, Plot 21' },
    { name: 'Francisco Reyes Rivera', born: 'February 11, 1946', died: 'September 19, 2017', location: 'Section E, Plot 12' },
    { name: 'Luz Fernandez Santos', born: 'March 6, 1934', died: 'November 2, 2013', location: 'Section F, Plot 45' },
    { name: 'Vicente Bautista Cruz', born: 'April 20, 1959', died: 'January 28, 2020', location: 'Section G, Plot 17' },
    { name: 'Consuelo Mendoza Reyes', born: 'May 5, 1943', died: 'March 14, 2015', location: 'Section H, Plot 29' },
    { name: 'Rodolfo Garcia Perez', born: 'June 13, 1961', died: 'October 27, 2022', location: 'Section I, Plot 4' },
    { name: 'Milagros Navarro Gomez', born: 'July 2, 1937', died: 'December 11, 2010', location: 'Section J, Plot 31' },
    { name: 'Ernesto Diaz Ramos', born: 'August 24, 1950', died: 'February 6, 2018', location: 'Section A, Plot 12' },
    { name: 'Estelita Tolentino Aquino', born: 'September 10, 1948', died: 'April 23, 2016', location: 'Section B, Plot 40' },
    { name: 'Carlos De Leon Cortez', born: 'October 17, 1963', died: 'June 8, 2021', location: 'Section C, Plot 19' },
    { name: 'Remedios Alonzo Mercado', born: 'November 8, 1932', died: 'August 30, 2007', location: 'Section D, Plot 35' },
    { name: 'Victor Gonzales Cruz', born: 'December 21, 1954', died: 'September 16, 2019', location: 'Section E, Plot 8' },
    { name: 'Aurora Rivera Reyes', born: 'January 9, 1945', died: 'November 25, 2014', location: 'Section F, Plot 26' },
    { name: 'Renato Santos Fernandez', born: 'February 26, 1957', died: 'January 10, 2023', location: 'Section G, Plot 3' },
    { name: 'Corazon Cruz Bautista', born: 'March 15, 1939', died: 'March 4, 2012', location: 'Section H, Plot 48' },
    { name: 'Romeo Reyes Mendoza', born: 'April 3, 1964', died: 'October 15, 2020', location: 'Section I, Plot 14' },
    { name: 'Imelda Perez Garcia', born: 'May 18, 1942', died: 'December 29, 2017', location: 'Section J, Plot 37' },
    { name: 'Rolando Gomez Navarro', born: 'June 7, 1951', died: 'February 21, 2015', location: 'Section A, Plot 25' },
    { name: 'Celia Ramos Diaz', born: 'July 22, 1946', died: 'May 12, 2011', location: 'Section B, Plot 9' },
    { name: 'Salvador Aquino Tolentino', born: 'August 1, 1960', died: 'July 18, 2022', location: 'Section C, Plot 44' },
    { name: 'Zenaida Cortez De Leon', born: 'September 29, 1935', died: 'August 7, 2008', location: 'Section D, Plot 11' },
    { name: 'Reynaldo Mercado Alonzo', born: 'October 14, 1958', died: 'September 3, 2019', location: 'Section E, Plot 32' },
    { name: 'Lilia Cruz Gonzales', born: 'November 27, 1940', died: 'November 20, 2013', location: 'Section F, Plot 18' },
    { name: 'Alberto Reyes Rivera', born: 'December 6, 1962', died: 'January 25, 2021', location: 'Section G, Plot 5' },
    { name: 'Yolanda Fernandez Santos', born: 'January 19, 1944', died: 'April 14, 2016', location: 'Section H, Plot 27' },
    { name: 'Danilo Bautista Cruz', born: 'February 10, 1955', died: 'October 6, 2020', location: 'Section I, Plot 41' }
  ];

  // Filter the data based on search query
  let filteredData = dummyData;
  if (firstName || lastName) {
    filteredData = dummyData.filter(person => {
      const pName = person.name.toLowerCase();
      const matchFirst = firstName ? pName.includes(firstName.toLowerCase()) : true;
      const matchLast = lastName ? pName.includes(lastName.toLowerCase()) : true;
      return matchFirst && matchLast;
    });
  }

  // 4. Inject the dummy data into the HTML
  const resultsList = document.getElementById('results-list');
  const template = document.getElementById('result-card-template');
  
  resultsList.innerHTML = '';

  if (filteredData.length === 0) {
    resultsList.innerHTML = '<p style="text-align: center; color: var(--stone); margin-top: 2rem; width: 100%;">No matching records found. Please try adjusting your search.</p>';
  } else {
    filteredData.forEach(person => {
      const clone = template.content.cloneNode(true);
      
      clone.querySelector('.name').textContent = person.name;
      clone.querySelector('.details').classList.add('private-detail');
      clone.querySelector('.born-detail').textContent = `Born: ${person.born}`;
      clone.querySelector('.died-detail').textContent = `Died: ${person.died}`;
      clone.querySelector('.location-detail').textContent = `Location: ${person.location}`;
      
      resultsList.appendChild(clone);
    });
  }

  // Timer Notification Countdown
  let timeLeft = 45;
  const noticeText = document.getElementById('privacy-notice-text');
  
  const countdown = setInterval(() => {
    timeLeft--;
    if (noticeText && timeLeft > 0) {
      noticeText.innerHTML = `<strong>Privacy Notice:</strong> Personal details will be blurred in ${timeLeft} seconds.`;
    } else if (timeLeft <= 0) {
      clearInterval(countdown);
      if (noticeText) noticeText.innerHTML = `<strong>Privacy Notice:</strong> Personal details are now blurred for privacy.`;
    }
  }, 1000);

  // Timer: Blur the details after 45 seconds (45000 milliseconds)
  setTimeout(() => {
    blurPrivateDetails();
  }, 45000);
});
