---
title: "Create your first AWS Billing Alarm"
description: "Learn how to create your first AWS Billing Alarm to avoid any unnecessary costs."
image: "/static/feature-images/first-aws-billing-alarm-feature-image.jpeg"
date: "Sep 09 2019"
status: "published"
tags:
  - aws
  - billing-alarm
  - cloudwatch
  - sns
---

Whether you’re a novice, just starting or a highly skilled AWS ninja, you need to keep an eye on those pesky AWS bills. AWS Billing is a very important and sometimes confusing part of AWS and if left unchecked can cause a lot of damage.

AWS gives a one-year free trial and there are a lot of great tutorials out there, enabling young devs to get started in no time. However, before getting started, it is strongly recommended that you set up a billing alarm to avoid any unnecessary costs.

> This article assumes that you have already created an AWS account

## What is a Billing Alarm?

Good question! Billing Alarm is a limit that you can set and AWS console lets you know (email) when you exceed that limit.

## Let’s get our hands dirty !! 👩‍💻 👨‍💻

Assuming you are logged into the console. Click on your **username** in the top right bar and select the **Billing Dashboard**. Alternately, you can also search for **billing** in the search bar, on the main page. On the left tab, under the **Preferences** section click **Billing preferences**.

![Preference Screen - AWS Console](/static/post-images/first-aws-billing-alarm/billing-preferences.png)

Check **Receive Billing Alerts** and press **Save Preferences**.

> **Note:** AWS recently updated its user interface (UI), so many existing tutorials on the net are still based on the older UI.

After that, you’ll need to navigate to **CloudWatch**. Open **Services** dropdown (top bar) and search for CloudWatch. It should be under **Management and Governance**. On the left side tab, click on **Billing** and then **Create Alarm** button.

> 💡CloudWatch displays all billing alerts in US East (N. Virginia) region only. So you will have to create all alarms in that region.

The **Create Alarm** button will take you to a setup wizard. There are four steps in the wizard:

1. Specify metrics and conditions
2. Configure actions
3. Add description
4. Preview and create

In the first step, you can add the alarm’s name, currency, and conditions that trigger the alarm.

![Specify Metrics - AWS Console](/static/post-images/first-aws-billing-alarm/billing-specify-metrics.png)

In the second step, you can configure when the alarm is triggered and who it goes
out to. To define who receives the notification, you will need to create or choose
an existing, SNS topic.

Complete the following steps;

1.  Select **Create new topic** under “Select an SNS topic” subheading
2.  You can change the topic name if you want.
3.  Add your email address. You can add multiple email addresses separated by commas (,)
4.  Press **Create topic**

![Creating SNS Topic - AWS Console](/static/post-images/first-aws-billing-alarm/billing-sns-topic.png)

In the third step just add a unique name and description (optional) for the alarm.
This is so you can recognize the alarm easily among others you may create in the
future.

The last step lets you preview all the information you have added in the
setup wizard and create the alarm.

> **Note:** Once the alarm is created, you will need to access your email and confirm the subscription to it.
