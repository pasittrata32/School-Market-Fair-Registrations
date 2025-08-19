
# 📝 School Market Fair Registration - Google Sheet Setup Guide

Follow these steps carefully to connect your registration form to a Google Sheet. This will allow you to collect all submissions automatically. You do not need to be a developer to do this!

### **Part 1: Create Your Google Sheet & Apps Script**

1.  **Create a new Google Sheet.**
    *   Go to [sheets.new](https://sheets.new) in your web browser.
    *   Give your spreadsheet a name, for example, "School Market Registrations".

2.  **Open the Apps Script editor.**
    *   In the top menu, click on `Extensions` -> `Apps Script`.
    *   A new browser tab will open with the script editor.

    

3.  **Replace the default code.**
    *   Delete any existing code in the `Code.gs` file.
    *   Copy the entire code block from the "Apps Script Code" section below and paste it into the editor.
    *   Click the "Save project" icon (it looks like a floppy disk).

### **Part 2: Apps Script Code (`Code.gs`)**

Copy and paste this exact code into your Apps Script editor.

```javascript
// This script acts as a secure backend to receive data from your React form and save it to the Google Sheet.

const SHEET_NAME = 'Registrations';

// This function runs when a POST request is sent to the script's URL.
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Get the currently active spreadsheet and the specific sheet we want to work with.
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // If the sheet doesn't exist, create it.
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    // Get the headers from the first row of the sheet.
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1);
    const headers = headerRange.getValues()[0];
    
    // If the sheet is completely empty, create the headers from the submitted data keys.
    if (sheet.getLastRow() === 0) {
      const newHeaders = Object.keys(data);
      sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
      
      // Append the first row of data.
      const rowData = newHeaders.map(header => data[header] || "");
      sheet.appendRow(rowData);
      
    } else {
      // If headers exist, ensure all columns from the new data are present.
      const dataKeys = Object.keys(data);
      const newHeaders = dataKeys.filter(key => !headers.includes(key));

      // If there are new columns, add them to the header row.
      if (newHeaders.length > 0) {
        sheet.getRange(1, headers.length + 1, 1, newHeaders.length).setValues([newHeaders]);
        headers.push(...newHeaders);
      }
      
      // Create the new row by mapping data to the correct header order.
      const rowData = headers.map(header => data[header] === undefined ? "" : data[header]);
      sheet.appendRow(rowData);
    }

    // Return a success message.
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', data: JSON.stringify(data) }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return an error message if something goes wrong.
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### **Part 3: Deploy the Script as a Web App**

This makes your script accessible via a URL so the form can send data to it.

1.  **Open the Deploy dialog.**
    *   At the top right of the Apps Script editor, click the blue **`Deploy`** button, then select **`New deployment`**.

2.  **Configure the deployment.**
    *   Click the gear icon next to "Select type" and choose **`Web app`**.
    *   In the form that appears:
        *   **Description:** You can type something like `Registration Form Handler`.
        *   **Execute as:** Leave this as `Me (your@email.com)`.
        *   **Who has access:** **Crucially, you MUST select `Anyone`**. This allows the form to send data without requiring users to log in. *This is secure because only your form knows this specific URL.*
    *   Click the **`Deploy`** button.

    

3.  **Authorize the script.**
    *   Google will ask for permission for the script to manage your spreadsheets. Click **`Authorize access`**.
    *   Choose your Google account.
    *   You might see a "Google hasn't verified this app" warning. This is normal for your own scripts. Click **`Advanced`**, then click **`Go to [Your Project Name] (unsafe)`**.
    *   On the next screen, review the permissions and click **`Allow`**.

4.  **Copy your Web App URL.**
    *   After deployment, a dialog box will appear with your **Web app URL**.
    *   Click the **`Copy`** button. This URL is what you need for the final step.

    

### **Part 4: Connect Your React App**

1.  **Open the React project code.**
    *   Navigate to the file: `components/RegistrationForm.tsx`.

2.  **Paste your URL.**
    *   Near the top of the file, you will see a line of code:
        ```typescript
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
        ```
    *   Replace the text `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL you copied in the previous step.

    **Example:**
    ```typescript
    // Before
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

    // After
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
    ```

3.  **Save the file.**

**That's it!** Your registration form is now fully connected. When a user submits the form, the data will automatically appear as a new row in your "Registrations" sheet.
