# RFH Akshara Run - Admin Panel Requirements

## Overview
Requirements gathered from chat discussion between Shyam (Manager) and Jey (Developer) on 8/4/2026 - 11/4/2026.

---

## 1. Test Data Management

### 1.1 Delete Test Transactions
- **Priority:** High
- **Status:** Pending
- **Description:** Remove or mark dummy/test transactions from the runners list page
- **Options:**
  - Add delete feature in admin page (if not already present)
  - Mark test transactions as "Failure" status
- **Note:** Successful test data should not appear in the runners list

---

## 2. Access Control & Authorization

### 2.1 Limited Access for Team Members
- **Priority:** High
- **Status:** Pending
- **Description:** Grant read-only access to specific team members
- **Requirements:**
  - Users should ONLY view registered runners database
  - No access to other admin controls
  - No edit/delete permissions

### 2.2 Admin Invite System
- **Priority:** Medium
- **Status:** Planned
- **Description:** Implement token-based admin invite feature
- **Requirements:**
  - Master admin can invite team members via token
  - Only invited users can sign up for limited access

### 2.3 Master Admin Configuration Panel
- **Priority:** Medium
- **Status:** Planned
- **Description:** Separate configuration page for master admin
- **Requirements:**
  - Toggle on/off different features for team members
  - Control what each team member can see and update

---

## 3. Website Updates

### 3.1 Akshara Run Link Activation
- **Priority:** High
- **Status:** Pending
- **Description:** Akshara Run link not active on Current Events page
- **Issue:** QR code scanning not leading to active registration page

### 3.2 Disable Old Event Links
- **Priority:** High
- **Status:** Pending
- **Description:** Update events page and disable all old/expired event links

---

## 4. Email Notification Issues

### 4.1 Stuck Transactions Investigation
- **Priority:** High
- **Status:** Pending
- **Description:** Some users reported not receiving confirmation emails
- **Action Required:** Investigate and resolve stuck transactions

---

## Action Items Summary

| # | Task | Assignee | Status |
|---|------|----------|--------|
| 1 | Add delete feature for test transactions | Jey | Pending |
| 2 | Implement read-only access for team members | Jey | Pending |
| 3 | Create admin invite system with tokens | Jey | Planned |
| 4 | Build master admin configuration panel | Jey | Planned |
| 5 | Activate Akshara Run link on events page | Jey | Pending |
| 6 | Disable old event links | Jey | Pending |
| 7 | Investigate stuck email transactions | Jey | Pending |
| 8 | Delete successful test data from list | Jey | Pending |

---

## Pending Information
- Email addresses of team members requiring limited access (to be provided by Shyam)



<!-- actual conversation with manager -->
[11:23 am, 8/4/2026] Shyam: Shyam
[11:24 am, 8/4/2026] Shyam: Their are many dummy transactions in runners list page. Can u remove them.? Or mark it as Failure.
[11:24 am, 8/4/2026] Shyam: Also, can u grant access to couple of ppl for that page.?
[11:35 am, 8/4/2026] Jey: Their are many dummy transactions in runners list page. Can u remove them.? Or mark it as Failure.
I think there is delete feature in admin page. If it's not there, I'll add it. Then you can control it
[11:35 am, 8/4/2026] Jey: Also, can u grant access to couple of ppl for that page.?
Give me their emails
[11:36 am, 8/4/2026] Shyam: Give me their emails
I dont want them to see all admin controls. Only they have to see the database runners, thats all.
[11:36 am, 8/4/2026] Jey: Also, can u grant access to couple of ppl for that page.?
I'll add a admin invite feature so you can invite them with a token and only they can signup
[11:36 am, 8/4/2026] Shyam: I think there is delete feature in admin page. If it's not there, I'll add it. Then you can control it
Ok, please add this option. I just want to remove tested transactions.
[11:37 am, 8/4/2026] Jey: I dont want them to see all admin controls. Only they have to see the database runners, thats all.
Let me see if I can make Authorization control of what team members can see an update
[11:38 am, 8/4/2026] Shyam: Let me see if I can make Authorization control of what team members can see an update
Ok, once u confirm u may add them only to view registered runners. No other option is needed to them.
[11:39 am, 8/4/2026] Jey: Ok, once u confirm u may add them only to view registered runners. No other option is needed to them.
You can control what they see. I will give master admin a seperate configuration page where you can turn on and off different things
[11:54 am, 10/4/2026] Shyam: Hello, Good Morning Raghu Anna.

I was trying to find "Akshara Run" link but it isn't active on the Current Events page of RFH, can you please check with whoever is handling website.

I'm finding the link by scanning the QR code
[11:54 am, 10/4/2026] Shyam: Shyam
[11:55 am, 10/4/2026] Shyam: Can you update events page and make sure all old links are disabled.
[9:44 pm, 10/4/2026] Jey: Ok Shyam
[10:44 pm, 11/4/2026] Shyam: Shyam
[10:44 pm, 11/4/2026] Shyam: Hello, Good Morning Raghu Anna.

I was trying to find "Akshara Run" link but it isn't active on the Current Events page of RFH, can you please check with whoever is handling website.

I'm finding the link by scanning the QR code
1. Did you complete this.??
[10:44 pm, 11/4/2026] Shyam: 2. Did you find a way to give access to 2 ppl.?
[10:44 pm, 11/4/2026] Shyam: 3. Are their any stuck transactions. I heard couple of them dint get email..
[11:09 pm, 11/4/2026] Shyam: 4. Did you delete test data which are successful.  It shouldn't show in the list..