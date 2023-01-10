var style = document.getElementsByTagName('link')[0];
const storedTheme = localStorage.getItem('curatednewstheme');
const check = localStorage.getItem('darkmode');
    if(storedTheme){
        style.setAttribute('href', storedTheme);
        if(check.includes("true")){
	  document.getElementById("darkmode").checked = true;
    document.documentElement.setAttribute("data-theme", "dark");
    style.setAttribute('href', 'https://curatednews.xyz/static/css/styledark.css');
	} else {
	  document.getElementById("darkmode").checked = false;
    document.documentElement.setAttribute("data-theme", "light");
    style.setAttribute('href', 'https://curatednews.xyz/static/css/style.css');
	}
    } else {

	const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	if(isDarkMode == true){
  		document.getElementById("darkmode").checked = true;
  		document.documentElement.setAttribute("data-theme", "dark");
  		style.setAttribute('href', 'https://curatednews.xyz/static/css/styledark.css');
	} else {
  		document.getElementById("darkmode").checked = false;
  		document.documentElement.setAttribute("data-theme", "light");
  		style.setAttribute('href', 'https://curatednews.xyz/static/css/style.css');
	}

    }


const toggle = document.getElementById('darkmode');

toggle.addEventListener('change', function() {
  if (this.checked) {
    document.body.removeAttribute('data-theme');
    document.documentElement.setAttribute("data-theme", "dark");
    style.setAttribute('href', 'https://curatednews.xyz/static/css/styledark.css');
    localStorage.setItem('curatednewstheme',"https://curatednews.xyz/static/css/styledark.css");
    localStorage.setItem('darkmode',"true");
  } else {
    document.body.removeAttribute('data-theme');
    document.documentElement.setAttribute("data-theme", "light");
    style.setAttribute('href', 'https://curatednews.xyz/static/css/style.css');
    localStorage.setItem('curatednewstheme',"https://curatednews.xyz/static/css/style.css");
    localStorage.setItem('darkmode',"false");
  }
});

