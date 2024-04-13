[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MYYMJH4f)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-7f7980b617ed060a017424585567c406b6ee15c891e84e1186181d67ecf80aa0.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=13818285)
# IDG2100-2023-oblig1

This document contains the description and starter code for `oblig1: IDG2100 Spring 2024`.

You are free to modify the starter code to customise the layout and create a theme more suitable for you. Make sure all the functionalities are included in the new layout.

# Goal

* Prove your understanding about `Web components` and how to use them.
* Demostrate you can create and build resuable `Web components` that can be used in any project or static webpage. 
* Show that you can pass data to a `Web components` from an ancestor and understand when to use `HTML attributes` or `properties` 
* Show you can pass data from a `Web component` to an ancestor using `Custom events`
* Demostrate you can provide CSS style encapsulation with your components
* Prove you can expose a way to customise or theme the Web component via CSS Custom Properties

The project is evaluated based on the previous goals. Therefore, you must show you understand all the previous concepts to get a passing grade. You may want to add a `readme` file to clarify any decision taking during the design/implementation process.

# Context

In this "oblig" you will be presented with a brief description of the problem you have to solve using Web component(s). 

This is an individual task, and you are required to build the component(s) from the ground up. Although, you may utilise snippets of code from tutorials or official documentation, you must clearly acknowledge the sources in the comments of your code. Plagiarism or cheating will be deemed to have taken place if the submitted code shows substantial similarities to other students' assignments or projects found online. In such cases, the matter will be reported to the NTNU appeals committee for further examination. If you have any doubts regarding the use of materials for your project, please reach out to the instructor for clarification. 

If the assignment is graded as "not approved" you will have an additional opportunity based on the following conditions:

1. The first version of the project must have been delivered within the set deadline (never after);
1. The project must consist on a significant piece of work (i.e.: do not deliver an empty assignment);
1. The second version of the project will have to include an additional task (as described later - See [Optional task](#Optional%20task)).

# Brief: the SUPER Assessor - Idea generator

`SUPER Assessor`, a game designed for educators, is the result of a research project undertaken by the Department of Design in Trondheim. Its primary objective is to aid educators in the development of unique assessment methods. These methods are intended to create innovative ways to evaluate and grade students. Currently, SUPER Assessor exists solely as a card game. However, the creators have plans to expand its reach by making it available online as a digital tool for educators, both in Norway and globally. Additionally, they aim to sell it through an online shop, fostering a space for customers to engage in discussions about the tool’s content.

The SUPER Assessor is currently in the development phase, and the following subsections provide a description of its present status.

## Target user - Educators 

At this stage of the product’s development, the primary users are educators in higher education, such as universities.

## Game elements

At the moment, the game consists of the following game components:

* 12 mission cards

* **80+ assessment cards**

* 1 board

* 18 pieces point tokens, 3 for each possible participant 

## Game rules - How to play

1. **Setup**: Players, usually educators but can include students or administrative staff, collaborate to create an assessment method. They start by choosing three missions (goals) for their assessment method. Each player then picks six cards from six categories: Who is assessed, The assessor, Artefact, Format, Context, and Timing. The game begins with one card from each category face-up on the table.

2. **Gameplay**: Players take turns and can choose from four actions:
   - Add a card to any category on the table.
   - Remove a card from the table by turning it face down.
   - Replace a card by turning the existing card face down and placing a new card over it.
   - Discard all cards in hand and draw six new ones.

   Players should always have six cards in hand, so they draw a new card after using one.

3. **Ending the Game**: The game ends when half or more of the players agree they are satisfied with the assessment method they've created. This triggers the final round.

4. **Scoring**: Players evaluate how well they achieved their missions, awarding up to three points for each mission.

Notice that this game can be played in different ways and can also serve as an idea generator. It's adaptable for both physical and digital play, and can be played individually or in groups.

## Game opportunities and limitations

Currently, the game is designed for physical play and requires team participation. However, there is potential for expanding its capabilities to include a digital version that retains all the features and mechanisms of the physical game.

One of the exciting opportunities being explored is the introduction of a solo play option, similar to solitaire or a puzzle game. This would provide a sandbox-like environment where players have access to all cards and can interact with them freely, independent of the rules that govern the multiplayer version.

In this first ‘oblig’, the primary goal of the project is to create a digital version of the game. **This version is intended to serve solely as an idea generator tool in a solo play option**, used to randomly generate assessment methods.

# Requirements: Web components

Your job is to create a Web component that allows players to visualise both `Mission` and `Assessment` cards. To do so, you will have to create, at least, two different web components that will share a lot of code.

* Web Component#1: `<SUPER-mission-card ...></SUPER-mission-card>`

* Web Component#1: `<SUPER-assessment-card ...></SUPER-mission-card>`

In the `assets/cards-png/` folder you will find two pictures (front and back) for each card. Please, don't forget that each card has two sides.

In the `assets/cards-db/` you will find a spreadsheet `SUPER-db.xlsx` with all the cards and their descriptions.

Here you have some things you must take into account when designing and implementing your component.

- Mission cards and assessment cards are different.
- All cards have a `card-id` (which is the same as the number of the card in the `cards-png` folder), a `card-type` (assessment or mission), a `card-name` and, a `card-description`.
- Assessment cards also have `card-details` and `card-category`.
- All the parts of the cards that are variable (e.g.: the `card-description`) will be configurable in the webcomponents using two different interfaces: `HTML attributes` and `JS properties`.
    - Example 1: 
    ````HTML
    <SUPER-mission-card 
        card-id="..."
        card-type="..."
        card-name="..."
        card-description="..."></SUPER-mission-card>
    ````

    - Example 2: 
    ````JS
    let missionCard = document.getElementById("card1");
    missionCard['card-id'] = " ...";
    missionCard['card-type'] = "...";
    missionCard['card-name'] = "...";
    missionCard['card-description'] = "...";
    ````

- Implement an **"active corner"** at the bottom-right corner of the card with the following functionalities:
    - Display a hint indicating the card's flippability when the user hovers over it.
    - Flip the card to reveal its other side upon user click.
- Incorporate an **"empty star"** icon at the top-right corner of the card. This icon will allow users to **"bookmark"** the card as a favourite. The icon click should trigger the following actions:
    - Fill the previously empty star icon to visually indicate the card's bookmarked status.
    - Emit a custom JavaScript event to notify other components of the application about the card's (de)selection status.
- The design of the cards can be found in the `assets/cards-png` folder. Ensure accuracy when implementing the design and maintain consistency in colors for each `card-type` and `card-category`.
    - By default, the background color of each card will match the corresponding card in the `cards-png` folder. However, the background color of the `mission` and `assessment` cards will be customisable via `custom properties`.
- The cards can be replaced programmatically. Verify the correctness of the implementation.
- All components must be responsive.

The main application, represented by the `index.html` file, will capture the custom events triggered when a card is bookmarked. The information of the selected card will be dynamically added to the `favourite-cards-list` container, as demonstrated in the example. This ensures that the application remains interactive and responsive to user actions. Remember, proper event handling is crucial for a smooth user experience! 😊

## Task

- Create the component as described in the previous section, adhering to all best practices and using the different specifications for building native **`custom elements`**.

- Style the component and provide user customization options via CSS **`custom properties`**. You can find an [example here](https://css-tricks.com/styling-a-web-component/).

- Add the components to the `index.html` using JavaScript:
    - Convert the `assets/cards-db/SUPER-db.xlsx` into a JSON file.
    - Create a script in `index.html` that randomly selects 3 mission and 6 assessment cards and places them in their respective locations on the page.

- Review the `index.html`, understand the code, and integrate your components in the designated areas.

- Every time a user bookmarks a card, add the favorite cards to the **`favourite-cards-list`**.

## Optional task

Implement this task if your assignment is graded as "Not approved" and you are entitled to deliver a second iteration (See [Context](#context))

For the optional task, you want to persists (i.e.: store) the favourite cards using the `localStorage`. 

The application using your Web component will send to the component the name of the key you want to create/update ([check `Storage.setItem()`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)). 

Let's consider the following example:

`````js
    localStorage.setItem('FAVOURITE_CARDS_LIST_STORE', cardsListAsString);
`````

- `cardsListAsString`, which must contain a string, will be stored in the local storage variable identified by the string `FAVOURITE_CARDS_LIST_STORE`.

- Update the Web component to persist all the favourite cards (this is, the same Web component will persist the new favourites every time a card is selected/bookmarked).

- Update the Web component to receive the `keyName` (i.e. `FAVOURITE_CARDS_LIST_STORE` in the previous example) to know where to store all the favourite cards.

- Create a new Web component (`favourite-card`) to visualise the card in a condensed version. This new component will replace the `<ul id="favourite-cards-list">` and it will render the persisted favourite cards from the localStorage (this is, it also needs to receive the `keyName`). The component will be updated every time a card is bookmarked.

NOTE: to make sure this new functionality works as expected try the following test:

- Load the page.
- Bookmark a card and check if the new favourite card is added in the favourite list section.
- Reload/refresh the page and check if the last favourite card is still in the list.

# Delivery

This assignment must be delivered in two different places: GitHub classroom and Blackboard.

- To deliver the assignment in GitHub Classroom, you only need to make sure all your changes and commits are pushed to your Git repository.

- It is imperative that you work exclusively with this Git repository to ensure that all modifications are trackable and your code is backed up on a regular basis. Hence, you should commit your progress directly to this repository each time you make advancements.

- Before delivering the assignment in Blackbard, make sure your project has all the files it needs. Delete any file or info not needed (this is `.git/` folder, etc.). Zip the project and upload the file to Blackboard. 

# DOCUMENTATION

Use this section to document your component.