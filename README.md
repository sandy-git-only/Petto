# Petto: Pets Adoption Integrated Platform

---
### Basic info
- Author: Li Hsuan Chen

- Skills:
    - React.js
    - Infinite Scroll
    - JavaScript
    - Google Maps Javascript API
    - Docker container
    - AWS(EC2/RDS/S3/SNS/SES)
    - RESTful API
    - ORM

### Main features
1. Notification
    - AWS SES(Amazon Email Simple Service)
        - Personal Matches Subscription - User subscribe to receive notification about the prferred type pets.
        - Adoptors can directly Message the Adoption Provider
    - AWS SNS: Group Subscription - Users will receive notifications in the event of a missing pet.
2. Display real-time adoption data
    - Display pets with various statuses on the map.
    - Determine the distance to the nearest pets within a 50 km radius.
3. Redis cache: Improved web data loading speed by 20x with Redis caching.
4. Integration with Government Shelters API

### Demo
- Home Page
<a name="home_page"></a>
![alt text](./images/home_page.png)

- Pets Page
<a name="pet_page"></a>
![alt text](./images/pet_page.png)

- Real-time adoption data
<a name="realtime_location"></a>
![alt text](./images/gps.png)

- Broadcasting
<a name="subscription_confirmation"></a>
![alt text](./images/sub_confirmation.png)
<a name="group_notification"></a>
![alt text](./images/group_notification.png)

- Personal Notification
<a name="personal_notification"></a>
![alt text](./images/personal_match.png)


### Architecture
<a name="architecture"></a>
![alt text](./images/structure.png)
