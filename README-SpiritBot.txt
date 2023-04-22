Spirit Bot is a Discord bot that will allow server owners to implement an overarching method of rewarding users for participation in the server.  Here are the requirements.

1: It must use slash commands, which is the new way to issue commands.

2: It must log everything to the console, input and output.  If a command is given, we  log it. If a response is given, we log it, if a procedure is performed, we log it.

3: Our Code will always be commented in SECTIONS.

4: We will compartmentalize as much as possible to make it easier to troubleshoot - we will not include everythign in the same file.

----------------------------------------

Database:

We are going to have a users table which will allow us to keep track of Cultists (which is what we call people in the database).  We will store:

UserID (primary key) (this will link them to the points table)
Username
Displayname
Join Date
Last Post Date


Sections

HELLO
This is a slash command /hello which will greet the user with the message of: Greetings! @username! The Spirit is indeed with you.  Here is your reward: (the reward is a random number between 1 and 100).

It will require that the user be in the database.  If not, it will add them to the database.

If they use it more than three times, it will do the same thing but subtract the points as a penalty.

CREEP
/creep @username will pull back the user's 

Displayname
Join Date
Last Post Date

And display in a message.  We will probably want to make this an embed at some point

That is it for now.
