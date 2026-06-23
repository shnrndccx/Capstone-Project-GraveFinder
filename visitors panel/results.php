<?php

include 'db_connect.php';

$firstName = $_GET['firstName'] ?? '';
$middleName = $_GET['middleName'] ?? '';
$lastName = $_GET['lastName'] ?? '';

$sql = "SELECT * FROM deceased
        WHERE first_name LIKE '%$firstName%'
        AND middle_name LIKE '%$middleName%'
        AND last_name LIKE '%$lastName%'";

$result = mysqli_query($conn, $sql);

?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet">
<title>Search Results — Garden of Memories</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet">
<!-- Link to the main stylesheet -->
<link rel="stylesheet" href="visitors css/style.css">
<!-- Link to the results-specific stylesheet -->
<link rel="stylesheet" href="visitors css/results.css">
</head>
<body class="privacy-protected-page">

<!-- NAV -->
<nav>
  <a href="index.html" class="nav-logo" style="text-decoration: none;">
    <img src="../assets/logo.png" alt="Garden of Memories Logo" class="nav-brand-img">
    <div class="nav-brand-text">
      <span class="brand-main">Garden of Memories Memorial Park and Chapels</span>
      <span class="brand-sub">Grave Finder</span>
    </div>
  </a>
  <a href="index.html" class="nav-cta" style="text-decoration: none;">Back to Home</a>
</nav>

<header class="page-header">
  <h1 class="page-title">Search <em>Results</em></h1>
  <p class="results-summary">
Showing results for:
<?php
echo htmlspecialchars(trim($firstName . ' ' . $middleName . ' ' . $lastName));
?>
</p>
  <button class="nav-cta" style="margin-top: 0.5rem; background: transparent;" onclick="openModal('filter-modal')">
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.3rem;"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg> Filter Results
  </button>
  
  <div style="margin-top: 1rem; display: flex; justify-content: center;">
    <div style="display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(196,166,97,0.1); border: 1px solid rgba(196,166,97,0.4); padding: 0.6rem 1.2rem; border-radius: 4px; font-size: 0.85rem; color: var(--charcoal);">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="var(--gold)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span id="privacy-notice-text"><strong>Privacy Notice:</strong> Personal details will be blurred in 45 seconds.</span>
    </div>
  </div>
</header>

<main class="results-container" id="results-list" style="max-width: 1280px; margin: 2rem auto; padding: 0 2rem;">

<?php
if(mysqli_num_rows($result) > 0){

    while($row = mysqli_fetch_assoc($result)){
?>
    <div class="result-card">
        <div class="result-info">
            <h2>
                <?php echo $row['first_name'].' '.$row['middle_name'].' '.$row['last_name']; ?>
            </h2>

            <div class="details" style="display:flex; flex-direction:column; gap:0.3rem;">
                <span>Born: <?php echo $row['birth_date']; ?></span>
                <span>Died: <?php echo $row['death_date']; ?></span>
                <span>
                    Location:
                    <?php
                    echo $row['location'] .
                         ' | Section ' . $row['section'] .
                         ' | Lot ' . $row['lot_no'];
                    ?>
                </span>
            </div>
        </div>
    </div>

<?php
    }
}else{
    echo "<p>No matching records found.</p>";
}
?>

</main>

<!-- Template for Dynamic Result Cards -->
<template id="result-card-template">
  <div class="result-card">
    <div class="result-info">
      <h2 class="name"></h2>
      <div class="details" style="display: flex; flex-direction: column; gap: 0.3rem;">
        <span class="born-detail"></span>
        <span class="died-detail"></span>
        <span class="location-detail"></span>
      </div>
    </div>
  </div>
</template>

<footer>
  <div class="footer-bottom">
    <span>© 2025 Garden of Memories Memorial Park & Chapels Inc. All rights reserved.</span>
  </div>
</footer>

<!-- Filter Modal -->
<div id="filter-modal" class="modal-overlay" onclick="closeModal(event, 'filter-modal')">
  <div class="modal-content" onclick="event.stopPropagation()">
    <button class="modal-close" aria-label="Close Modal" onclick="closeModal(event, 'filter-modal')">✕</button>
    <p class="section-tag" style="justify-content:flex-start;">Refine your search</p>
    <h2 class="section-title" style="margin-top:0; font-size: 2.2rem;">Filter <em>Results</em></h2>
    <div class="gold-bar"></div>
    
    <form class="contact-form" style="padding:0; border:none; box-shadow:none; background:transparent;" onsubmit="event.preventDefault(); document.getElementById('system-message-text').innerText = 'Filters applied!'; closeModal(event, 'filter-modal'); openModal('system-message-modal');">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <div class="field-group" style="flex: 1;">
          <label class="field-label">Section</label>
          <select class="field-select">
            <option value="all">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>
        </div>
        <div class="field-group" style="flex: 1;">
          <label class="field-label">Year of Death</label>
          <select class="field-select">
            <option value="all">Any Year</option>
            <option value="2020s">2020 - Present</option>
            <option value="2010s">2010 - 2019</option>
            <option value="2000s">2000 - 2009</option>
            <option value="older">Before 2000</option>
          </select>
        </div>
      </div>
      <button type="submit" class="submit-btn" style="margin-top: 1rem;">Apply Filters</button>
    </form>
  </div>
</div>

<!-- System Message Modal -->
<div id="system-message-modal" class="modal-overlay" onclick="closeModal(event, 'system-message-modal')">
  <div class="modal-content" onclick="event.stopPropagation()" style="text-align: center; max-width: 450px;">
    <button class="modal-close" aria-label="Close Modal" onclick="closeModal(event, 'system-message-modal')">✕</button>
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--sage-dark)" stroke-width="2" style="width: 48px; height: 48px; margin-bottom: 1rem; margin-top: 1rem;">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <h2 class="section-title" style="margin-top:0; font-size: 2rem;">Notification</h2>
    <p class="section-body" id="system-message-text" style="margin-bottom: 1.5rem;"></p>
    <button class="search-btn" style="margin: 0 auto; display: inline-block; align-self: auto;" onclick="closeModal(event, 'system-message-modal')">Okay</button>
  </div>
</div>

<!-- <script src="visitors javascripts/results.js"></script> -->
<script src="visitors javascripts/script.js"></script>
</body>
</html>
