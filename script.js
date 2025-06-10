// Diseases list
const diseases = [
  "Diabetes", "Hypertension", "Asthma", "Cancer", "Arthritis", "Depression", "Anxiety",
  "Migraine", "Heart Disease", "Stroke", "Tuberculosis", "Hepatitis", "Malaria",
  "Cholera", "Dengue", "Covid-19", "Alzheimer's", "Parkinson's", "Obesity",
  "Thyroid Disorder", "Psoriasis", "Eczema", "Allergy", "Flu", "Cold",
  "Pneumonia", "Bronchitis", "Glaucoma", "Cataract", "HIV/AIDS",
  "Kidney Disease", "Liver Disease", "Ulcer", "Gout", "Anemia", "Osteoporosis",
  "Sleep Apnea", "Epilepsy", "Multiple Sclerosis", "Cystic Fibrosis", "Leukemia",
  "Lupus", "Crohn's Disease", "Irritable Bowel Syndrome", "Gastritis", "Acne",
  "Psoriatic Arthritis", "Chronic Fatigue Syndrome", "Pancreatitis", "Mononucleosis",
  "Hypoglycemia", "Sinusitis", "Tonsillitis", "Others"
];

// Elements
const illnessSelect = document.getElementById('illness');

function loadDiseases() {
  illnessSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select Illness --';
  illnessSelect.appendChild(defaultOption);

  diseases.forEach(disease => {
    const option = document.createElement('option');
    option.value = disease;
    option.textContent = disease;
    illnessSelect.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDiseases();
  attachVitalsListeners();
});

// Vital Status functions
function getBpStatus(bp) {
  if (!bp) return 'Normal';
  const parts = bp.split('/');
  if (parts.length !== 2) return 'Normal';
  const systolic = parseInt(parts[0]);
  const diastolic = parseInt(parts[1]);

  if (systolic >= 140 || diastolic >= 90) return 'High';
  if (systolic < 90 || diastolic < 60) return 'Low';
  return 'Normal';
}

function getSugarStatus(sugar) {
  if (!sugar) return 'Normal';
  sugar = parseFloat(sugar);
  if (sugar > 140) return 'High';
  if (sugar < 70) return 'Low';
  return 'Normal';
}

function getHeartRateStatus(hr) {
  if (!hr) return 'Normal';
  hr = parseInt(hr);
  if (hr > 100) return 'High';
  if (hr < 60) return 'Low';
  return 'Normal';
}

function getTempStatus(temp) {
  if (!temp) return 'Normal';
  temp = parseFloat(temp);
  if (temp > 37.5) return 'High';
  if (temp < 36) return 'Low';
  return 'Normal';
}

function getWeightStatus(weight) {
  if (!weight) return 'Normal';
  weight = parseFloat(weight);
  if (weight < 30) return 'Low';
  if (weight > 150) return 'High';
  return 'Normal';
}

function updateStatus(id, status) {
  const el = document.getElementById(id);
  el.textContent = status;
  el.className = 'status ' + status;
}

function attachVitalsListeners() {
  const weightInput = document.getElementById('weight');
  weightInput.addEventListener('input', () => {
    updateStatus('weightStatus', getWeightStatus(weightInput.value));
  });

  const bpInput = document.getElementById('bp');
  bpInput.addEventListener('input', () => {
    updateStatus('bpStatus', getBpStatus(bpInput.value));
  });

  const sugarInput = document.getElementById('sugar');
  sugarInput.addEventListener('input', () => {
    updateStatus('sugarStatus', getSugarStatus(sugarInput.value));
  });

  const heartInput = document.getElementById('heartRate');
  heartInput.addEventListener('input', () => {
    updateStatus('heartRateStatus', getHeartRateStatus(heartInput.value));
  });

  const tempInput = document.getElementById('temperature');
  tempInput.addEventListener('input', () => {
    updateStatus('tempStatus', getTempStatus(tempInput.value));
  });
}

// PDF generation on form submit
document.getElementById('healthForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // Gather data
  const data = {
    patientName: document.getElementById('patientName').value.trim(),
    age: document.getElementById('age').value.trim(),
    bloodGroup: document.getElementById('bloodGroup').value,
    illness: document.getElementById('illness').value,
    doctorNotes: document.getElementById('doctorNotes').value.trim(),
    weight: document.getElementById('weight').value.trim(),
    weightStatus: getWeightStatus(document.getElementById('weight').value.trim()),
    bp: document.getElementById('bp').value.trim(),
    bpStatus: getBpStatus(document.getElementById('bp').value.trim()),
    sugar: document.getElementById('sugar').value.trim(),
    sugarStatus: getSugarStatus(document.getElementById('sugar').value.trim()),
    heartRate: document.getElementById('heartRate').value.trim(),
    heartRateStatus: getHeartRateStatus(document.getElementById('heartRate').value.trim()),
    temperature: document.getElementById('temperature').value.trim(),
    tempStatus: getTempStatus(document.getElementById('temperature').value.trim())
  };

  // Simple validation
  if (!data.patientName || !data.age || !data.bloodGroup || !data.illness) {
    alert('Please fill all required fields.');
    return;
  }

  generatePdfReport(data);
});

// PDF using jsPDF
function generatePdfReport(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor('#004080');
  doc.text('Smart Health Tracker Report', 105, 20, null, null, 'center');

  doc.setFontSize(12);
  doc.setTextColor('#000');
  doc.line(15, 25, 195, 25);

  // Patient info
  doc.setFontSize(14);
  doc.text('Patient Details:', 15, 35);
  doc.setFontSize(12);
  doc.text(`Name: ${data.patientName}`, 15, 45);
  doc.text(`Age: ${data.age}`, 15, 53);
  doc.text(`Blood Group: ${data.bloodGroup}`, 15, 61);

  // Illness
  doc.setFontSize(14);
  doc.text('Illness / Disease:', 15, 75);
  doc.setFontSize(12);
  doc.text(data.illness, 15, 83);

  // Doctor notes
  doc.setFontSize(14);
  doc.text("Doctor's Notes:", 15, 97);
  doc.setFontSize(12);

  const splitNotes = doc.splitTextToSize(data.doctorNotes || 'N/A', 180);
  doc.text(splitNotes, 15, 105);

  // Vitals
  doc.setFontSize(14);
  doc.text('Vitals:', 15, 130);
  doc.setFontSize(12);

  const vitalsStart = 138;
  const gap = 10;

  doc.text(`Weight: ${data.weight || 'N/A'} kg (${data.weightStatus})`, 15, vitalsStart);
  doc.text(`Blood Pressure: ${data.bp || 'N/A'} mmHg (${data.bpStatus})`, 15, vitalsStart + gap);
  doc.text(`Blood Sugar: ${data.sugar || 'N/A'} mg/dL (${data.sugarStatus})`, 15, vitalsStart + gap * 2);
  doc.text(`Heart Rate: ${data.heartRate || 'N/A'} bpm (${data.heartRateStatus})`, 15, vitalsStart + gap * 3);
  doc.text(`Body Temperature: ${data.temperature || 'N/A'} °C (${data.tempStatus})`, 15, vitalsStart + gap * 4);

  // Footer
  doc.setLineWidth(0.5);
  doc.line(15, 280, 195, 280);
  doc.setFontSize(10);
  doc.setTextColor('#888');
  doc.text('Generated by Smart Health Tracker', 105, 287, null, null, 'center');

  // Save PDF
  doc.save(`${data.patientName.replace(/\s+/g, '_')}_Health_Report.pdf`);
}
