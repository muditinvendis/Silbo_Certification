document.querySelectorAll('input[name="form-type"]').forEach((radio) => {
  radio.addEventListener('change', function (e) {
    switchForm(e.target.value);
  });
});

function switchForm(formType) {
  const deviceSection = document.getElementById('device-section');
  const personSection = document.getElementById('person-section');

  if (formType === 'device') {
    deviceSection.classList.add('animation-scale-fade');
    deviceSection.style.display = 'block';
    personSection.style.display = 'none';
  } else if (formType === 'person') {
    personSection.classList.add('animation-scale-fade');
    deviceSection.style.display = 'none';
    personSection.style.display = 'block';
  }
}

function setInitialDisplayState() {
  const deviceSection = document.getElementById('device-section');
  const personSection = document.getElementById('person-section');
  const deviceRadio = document.getElementById('device-radio');

  if (deviceRadio.checked) {
    deviceSection.style.display = 'block';
    personSection.style.display = 'none';
  } else {
    deviceSection.style.display = 'none';
    personSection.style.display = 'block';
  }

  deviceSection.classList.remove('animation-scale-fade');
  personSection.classList.remove('animation-scale-fade');
}

setInitialDisplayState();

document.getElementById('certificate-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const serverIp = document.getElementById('server-ip').value;

  if (document.getElementById('device-radio').checked) {
    const siteId = document.getElementById('site-id').value;
    const deviceType = document.getElementById('device-type').value;
    const modelName = document.getElementById('model-name').value;
    const deviceId = document.getElementById('device-id').value;
    const customerName = document.getElementById('customer-name').value;
    const projectType = document.getElementById('project-type').value;

    const deviceFormData = {
      server_ip: serverIp,
      site_id: siteId,
      device_type: deviceType,
      model_name: modelName,
      device_id: deviceId,
      customer_name: customerName,
      project_type: projectType,
    };

    try {
      const certificateData = await generateDeviceCertificate(deviceFormData);
      downloadCertificate(certificateData, deviceFormData);
      document.getElementById('certificate-form').reset();
    } catch (error) {
      console.error(error);
      alert('Failed to generate device certificate. Please try again.');
    }
  } else if (document.getElementById('person-radio').checked) {
    const personName = document.getElementById('person-name').value;
    const projectName = document.getElementById('project-name').value;
    const projectScope = document.querySelector('input[name="project-scope"]:checked').value;

    const personFormData = {
      server_ip: serverIp,
      person_name: personName,
      project_name: projectName,
      project_scope: projectScope,
    };

    try {
      const certificateData = await generatePersonCertificate(personFormData);
      downloadCertificate(certificateData, personFormData);
      document.getElementById('certificate-form').reset();
    } catch (error) {
      console.error(error);
      alert('Failed to generate person certificate. Please try again.');
    }
  }
});

async function generateDeviceCertificate(formData) {
  const apiUrl = `http://192.168.1.107:8000/generate_certificate/device/`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error('Failed to generate device certificate. Please try again.');
    }

    const certificateData = await response.blob();
    return certificateData;
  } catch (error) {
    console.error('Failed to generate device certificate:', error);
    throw new Error('Failed to generate device certificate. Please try again.');
  }
}

async function generatePersonCertificate(formData) {
  const apiUrl = `http://192.168.1.107:8000/generate_certificate/person/`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error('Failed to generate person certificate. Please try again.');
    }

    const certificateData = await response.blob();
    return certificateData;
  } catch (error) {
    console.error('Failed to generate person certificate:', error);
    throw new Error('Failed to generate person certificate. Please try again.');
  }
}

function downloadCertificate(certificateData, formData) {
  const blob = new Blob([certificateData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  let fileName;

  if (document.getElementById('device-radio').checked) {
    fileName = `${formData.device_type}_${formData.site_id}_${formData.customer_name}.ovpn`;
  } else if (document.getElementById('person-radio').checked) {
    fileName = `${formData.project_name}_${formData.person_name}.ovpn`;
  }
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => {
    window.location.href = 'successPage.html';
  }, 3000);
  URL.revokeObjectURL(url);
}
