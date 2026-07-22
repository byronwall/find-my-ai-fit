# Brainstorming tool and AI use-case generator with hierarchical grid UI

Source package: 20260721-204527-6C7699A2-context

Duration: 50:22

## Summary

The memo explores two closely related product ideas: a hosted AI use-case generator that uses LinkedIn/profile inputs, and a broader brainstorming interface that organizes ideas in a grid or hierarchy. The speaker repeatedly returns to progressive disclosure, tagging, row/column views, and zoomable nested cells as the core interaction model for making LLM brainstorming outputs more useful and actionable.

## Key Points

- A hosted AI use-case generator could replace copy-pasting prompts into ChatGPT and use richer inputs like LinkedIn profile exports.
- The output should not just be chat text; it should be organized into titles, summaries, categories, and a grid or matrix view.
- Progressive disclosure and zoomable hierarchy are central: start broad, then narrow into cells, subcells, and more specific suggestions.
- The interface could support lead gen, consulting funnels, or a general-purpose brainstorming experience depending on the product goal.
- The same structure could apply to transcripts, tasks, documents, and other large contexts that need tagging and decomposition.

## Transcript

### Two related product ideas: brainstorming and AI use-case generation

Time: 0:01 - 3:10

#### Summary

The speaker introduces the memo as being about two linked ideas: a brainstorming application and an AI use-case generator. They describe a conference example that inspired the thinking and frame the problem as improving on a ChatGPT prompt by making the experience better and more structured.

#### Transcript

[0:01] Alright, here we go.

[0:05] This note is going to focus on I guess two related threads.

[0:13] One is the idea of a brainstorming application.

[0:17] The other is the idea of AI use case generator, let's call it.

[0:27] So earlier today I was at this conference, and Colin, who was speaking, had a section in there where he was talking about trying to help people brainstorm or come up with ideas or ways that they might be able to get AI to work for them.

[0:48] And he had a decent little prompt that asked a couple questions and then started generating ideas and then did the standard thing of pick some generate some more.

[1:25] Three of the letters.

[1:45] And agentic pipelines.

[1:47] And it really smashed those two ideas together in very useful ways.

[1:53] I think a decent chunk of what fell out of the brainstorming is all stuff that would be highly relevant to what we're doing at relational, but is also just generally interesting.

[2:08] It sort of lays out a roadmap, maybe lays out the contours of what you might need to go build to have a really powerful visualization.

[2:22] And so there's something about it that was pretty compelling.

[2:29] And so I guess there's two ways to take it.

[2:31] One is well, just as a general brainstorming system, it was quite good, but also it's Chat GPT, so uh start thinking about if you're gonna do that more than once, how would you make it better?

[2:46] All right, and then the second dimension is if the goal really is to help people think of ways to generate AI use cases, well, what would be a better starting point than having them copy paste the prompt into ChatGPT?

### Hosted use-case generator with LinkedIn profile as the main input

Time: 3:14 - 7:14

#### Summary

The speaker shifts to the use-case generator idea and argues for a hosted product instead of user-driven prompt pasting. They propose using a LinkedIn profile export or PDF as the main input because it is accessible, rich, and usually kept up to date.

#### Transcript

[3:14] So let's do the let's do this the second one first, let's do the use case thing because I think there's some pretty within reach ways to do this.

[3:23] Uh first and foremost is what you'd really like is to have it be a hosted thing.

[3:31] So instead of having the user go paste their prompt into their AI agent, you just host it.

[3:39] You could probably get pretty far with uh mini model.

[3:44] But also the total tokens aren't that huge depending on what the input becomes.

[3:50] So the cost is probably pretty small compared to the potential lead gen you'd get off of hosting this thing.

[4:03] So what would you do?

[4:04] What would be better inputs?

[4:06] First and foremost, you really want to make it easy for the user to give you their info.

[4:14] What's the best way to get info from most people?

[4:18] LinkedIn profile.

[4:20] I think that's got a pretty rich set of data.

[4:23] It's easily exportable.

[4:25] Most people keep it up to date.

[4:28] And so there's probably two ways about it.

[4:30] One is maybe paste the URL, but I think that's probably gonna run a foul of LinkedIn and scraping and all of that.

[4:41] And so better, or at least more reliable, would be have the user go export their LinkedIn profile.

[4:52] And uh that'd be a starting point.

[4:55] Just a simple drag your LinkedIn profile PDF over into our form, we run it through, use case audit, and you're off to the races.

[5:15] Which is if somebody has given you their LinkedIn profile or like the download PDF resume thing, you could very quickly go do three, four, five other things with it as well.

[5:29] You could offer critique on the bullet points.

[5:34] You could rewrite things in terms of them having a specific goal.

[5:40] You could give them some areas to go learn more.

[5:44] So it's one thing to think about how might AI help me.

[5:47] It's another to think about let me just direct AI in the direction of how to improve.

[6:13] Not sure, I'll think about that.

[6:17] But let's uh give back to the AI use case thing.

[6:19] So you uh have them drop in their LinkedIn profile, you go and generate the first round of suggestions.

[6:29] I think you want it to be zero click if possible.

[6:36] Maybe one click, maybe zero, you just drag and drop.

[6:39] I think that's probably what you want.

[6:43] Um, but you you want to collect enough input information that you can very quickly take that info and go generate the use cases.

[6:57] Now I do wonder a little bit if my chat GPT output was good because I told it I worked at relational AI and it was doing enough web searches that it could pull in enough info that it got a little bit of extra juice from that.

### Context, lead gen, and the first pass at useful outputs

Time: 7:15 - 10:35

#### Summary

The speaker considers how extra context improves results and how the tool might feed a consulting or lead-gen funnel. They also think about whether the system should hand people prompts for their own AI tools or keep them inside the product.

#### Transcript

[7:15] Something consider because some part of the quality or relevance of the results is what really fell it as compelling.

[7:29] You can get generic results for HR business partner.

[7:37] But you get results that are sitting at the intersection of HR bus partner at a auto company that's known to be in a union negotiation with a different beast, that's a lot more context.

[7:58] But even without all the extra context, you could probably very quickly give some useful use cases and then immediately turn around and ask some questions to help refine.

[8:13] And so where's that put us?

[8:19] I think that then just leads into what what does it look like to have a better brainstorming tool at that minute.

[8:31] But then what do you do with the results?

[8:33] Okay, to get this use case setting.

[8:35] Um depending on what spits out, you could just have the person flag which one seemed most relevant to them.

[8:44] And I really like the sound of this, but I I don't know where to use it for lead gen.

[8:50] Um so one thought, if you're think in funnels, one thought is to try and quickly get the person into a consulting funnel.

[8:59] Well, hey, that'll help you.

[9:05] Another way to do it is to say, hey, this use case is actually well within reach of chat GPT or the quad or something.

[9:16] Here's the prompt that would help you go after that.

[9:21] Um especially considering how good like Codec's desktop app is at bringing in information from the user's context.

[9:32] My guess is for somebody who's got that app and is able to use it, it could get really really far with just an idea that they want to pursue.

[9:44] Um guess that's one option is just off offload them into a uh lead gen funnel.

[9:54] Next option is to offload them into their AI system of choice.

[10:01] Next option is you know, could you take that read and have it be uh like the next prompt in your system?

[10:12] Like could you keep them inside your AI system?

[10:19] I don't know.

[10:21] At a certain point, you're just kind of like reinventing a worse version of ChatGPT, but maybe the uh there's some subset of use cases where it would still be better.

[10:32] I don't think about that.

### Input UX: ask less, start with fields, and collect more context up front

Time: 10:44 - 12:27

#### Summary

The speaker broadens into general brainstorming UX and emphasizes making inputs easier and more structured. If the needed questions are already known, they should become form fields rather than generated questions, and the user should provide useful context up front instead of being forced through extra prompts.

#### Transcript

[10:44] I think what would make that better.

[10:50] Well, now we're in the world of just general brainstorming.

[10:55] How can you make it so that an AI is easier to brainstorm with?

[11:02] Um, there's just the obvious UI UX improvements.

[11:09] So if the initial prompt is spitting back three questions that you have to answer, uh, even just putting those in a set of form fields is way better, especially if you know you're going to need that information.

[11:28] Like why run the prompt just to trigger the questions, if you know exactly what the questions are in advance.

[11:36] That's why step one is if you know your brainstorming with inputs, that would be helpful.

[11:45] You should just start with the inputs.

[11:49] But this also kind of gets back to the whole, well make it even easier than that, just have the user upload something that they already have ready access to, like the LinkedIn profile.

[12:02] But if you're not going to do that, or if you want the LinkedIn profile plus maybe some augmented context, uh start with it.

[12:11] Plus then you're not wasting tokens, having it generate questions that are effectively static.

[12:20] Alright, so that's uh UI UX on the input side of things, like the initial, let's get this thing going.

### Output structure: titles, categories, and grid-based organization

Time: 12:36 - 15:11

#### Summary

The speaker starts defining the shape of the output: titles, summaries, and category badges. They explore using categories for color coding, swim lanes, and a grid of suggestions that can be glanced at, grouped, and expanded.

#### Transcript

[12:27] Um help on the initial side of things.

[12:36] Let's say no.

[12:36] Let's say we've got this LinkedIn profile.

[12:39] It gets us going.

[12:41] And it certainly feels like a good start.

[12:44] So then what happens?

[12:46] Well, it's running.

[12:55] Let's be going to output.

[12:58] It seems pretty clear you want some sort of a title or summary.

[13:08] You want a sentence or two describing what it is.

[13:14] The badge thing was kind of doing this uh set of categories around how this is something you could go build.

[13:21] This is something you could go uh educate on.

[13:26] I don't know what the other ones were.

[13:29] And so that's sort of category useful.

[13:46] Is that category useful?

[13:48] Maybe.

[13:49] Um let's assume you carry the category along.

[13:54] How could you actually use it?

[13:55] Well, you could actually color code by it.

[13:57] You could arrange things into swim lanes, combone style.

[14:02] Here's some ideas to go build.

[14:07] You could kind of group by topic.

[14:14] It just kind of touches up against one of the displays that Fantastic had, which was row by column with the data points in the middle.

[14:24] And so you're sort of filling in this grid of options.

[14:27] For Fantastic, it was like a grid of tasks.

[14:31] Your stats that are urgent and do tomorrow.

[14:34] Your stats that are high impact and do tomorrow.

[14:39] And so then you could add a glance see where the distribution was.

[15:06] I want to use AI to build something.

### Generating more ideas and working at the level of whole suggestions

Time: 15:15 - 18:20

#### Summary

The speaker imagines interactive generation where users click to request more ideas, select items they like, and steer the system by suggestion rather than by sentence-level editing. They favor working at the level of the whole suggestion and using follow-up prompts or filters to refine direction.

#### Transcript

[15:20] What's that?

[15:21] That's 18.

[15:23] If you had two ideas in each.

[15:41] Now we're clicking rows and columns.

[15:44] And then they click generate more, and now you get some additional suggestions in the rows and columns or in the cells.

[15:54] Maybe you're aiming for five, eight, ten ideas per click.

[16:01] They fill into the cells.

[16:05] And you could be clicking the items and saying, oh yes, I like this.

[16:13] You you've obviously got clicking the rows and cells.

[16:17] Um now we're kind of in the world of what at what level of granularity do you want to work with these things?

[16:26] Let's assume it's a title and two or three sentences.

[16:30] Um you could just say I like that idea.

[16:33] Like hold that to the side.

[16:35] You might say, I like that sentence there, like it describes something that I like, kind of in isolation from the whole.

[16:52] So I like that idea, but take it in this direction.

[16:56] So kind of like a follow-up on an idea.

[16:59] So maybe you're annotating.

[17:02] I mean, I guess my gut is that working at the level of the suggestion is probably sufficient.

[17:09] Like it's probably uncommon that the suggestions perfect, but for the last sentence, or only the last sentence is good, but the rest of it's bad.

[17:18] Way more likely is you just want to like click the suggestion, and then maybe you offer some choices more like this, combine this with you type in the idea.

[17:36] Um less like this.

[17:39] Well, you probably don't say less like this, you probably just like hide the row or column.

[17:43] Maybe once you've got this row column interface, it becomes clear that you're kind of generating on two axes.

[17:52] And so if the original axes were area and type, maybe you can swap it over to generate on a different set of axes.

[18:03] What would that look like?

[18:04] Maybe time is an axis.

[18:14] So time frame verse category.

[18:18] That might work.

### Personal context, roles, and dimensions for narrowing the suggestions

Time: 18:53 - 22:55

#### Summary

The memo explores how the system should account for different life areas, roles, and search goals instead of assuming the user only wants suggestions for their current job. The speaker thinks the UI should let people expand from a core work profile into personal life, hobbies, job search, or other directions.

#### Transcript

[18:53] I mean, it's kind of like categories.

[18:56] You can imagine I'm a chemical engineer working at a plant.

[19:20] Yeah, it's like there's some sort of hierarchy that's lurking in there because use cases uh can be generic to you as a chemical engineer.

[19:35] But maybe also on your LinkedIn profile, it detects uh that you're sort of doing three or four roles, and so it might even make suggestions within a role, or maybe you could somehow kind of dial it in that way.

[19:54] Yeah, obviously I've had these jobs over time, but let's focus on a job search.

[20:05] Um yeah, so I guess I guess that's uh interesting question.

[20:12] It's like if you're just dropping in your LinkedIn profile, the thing's probably liable to get super over-indexed on your existing experience, and it's almost just like assumed that the use cases are help me with my current role.

[20:30] But maybe maybe that's the dimension is like uh in what areas am I looking to expand.

[20:38] Well, yeah, I've got my current role, but I've got the job I've got my eye on.

[20:43] I've got the job search, I'm about to start.

[20:47] I've got the uh well, yeah, it's all my job stuff, but I'm actually trying to find uh not-for-profits that intersect my work.

[21:03] So all of these are sort of like uh picturing like a visual, you've got this like core, which is the core is work experience because that's what the LinkedIn profile is gonna buy us toward and it's like from there you're possibly expanding out into other areas of your life and so maybe maybe that's something to collect or show in the UI.

[21:38] This might be a little bit on the input side of things.

[21:41] It's like well you gave us this uh LinkedIn profile so that's certainly good context a good starting point but what else could you give us?

[21:54] Well if you're looking for hobbies it would certainly help if you told us something about what you're looking for there.

[22:02] And so I guess some of this is the uh I mean you could easily take a single LinkedIn profile and kind of give these three four five different directions to take the thing it's like what's the immediate direction to take this thing here's suggestions that are relevant to your role uh today tomorrow in the future based off of what we think you're doing and then there could be another set of suggestions which are hey if you're trying to expand personally here's some just generic stuff but if you answer these questions we'll go swap these out for significantly better hints um that's all feeling pretty good.

### A general-purpose exploration system with time, intent, and narrowing

Time: 22:58 - 27:34

#### Summary

The speaker generalizes the idea into a flexible exploration system that can start broad and then narrow with more context. They describe a grid of suggestions, plus a 20-questions-like process that asks for the most useful information to determine where the user is headed.

#### Transcript

[22:55] Then I guess I'm gonna get back to what's the goal of this thing.

[22:58] Is it lead in for a consulting company?

[23:00] Well, in that case, you might just buy it towards the stuff that you can handle.

[23:04] But if it's a general purpose tool, you might allow for a bit more exploration.

[23:12] I do think there's something about there's got to be a handful of kind of dimensions that people would take it.

[23:19] And so one dimension is just like which aspect of your personal life, which aspect of your life, personal work, kids.

[23:33] Time is an important one.

[23:35] Now, tomorrow.

[24:31] And now you've got just a little bit of this like profile that's following you around as you're doing this brainstorming.

[24:46] Alright, so maybe it's the same that one kind of core visual for this is like a grid of suggestions because the grid lets you arrange things on uh zero, one or two dimensions quite easily.

[25:03] Zero means you're just showing cards.

[25:06] One means you're showing cards grouped by category two is where you're showing you know narrow cards, small small height cards, maybe two or three in a box with nine boxes total on the screen, and you're letting the user click to collect the ones of interest, maybe you're letting the user click the row or column to indicate more like that, or they're clicking to remove.

[25:40] I don't want that now.

[25:43] Um then somehow you're in all of this, it's almost like 20 questions style.

[25:53] How can I get the info that's most useful to determine where you're trying to go?

[26:00] And so then you're having the LLM on each turn generate oh these bits of information would help point in other directions.

[26:19] Yeah, something specific here where they're and then I kind of have this additional visual of your like narrowing.

[26:49] Alright, sort of narrowing meaning.

[26:52] You're certainly going from general to specific.

[26:55] You're going from kind of fluffy ideas to way more actionable.

[27:02] Yeah, so even that's probably a dimension to play with.

[27:04] What are we looking for?

[27:06] Strategy?

[27:07] Practical next steps.

[27:10] Uh questions to answer, things to consider, preferences to declare.

[27:17] Um okay, but you're going from general to specific, you're going from like a wide aperture.

[27:25] Oh yeah, just give me any ideas.

[27:28] So very quickly, you're narrowed in on.

[27:31] Give me ideas about those agentic visualization pipelines.

### What happens after brainstorming: next actions, profiles, and report generation

Time: 27:59 - 33:29

#### Summary

The speaker asks how the system should end and what to do with the generated ideas. They imagine selecting interesting items, synthesizing a profile of what the user likely wants next, and producing practical next steps or a final report rather than endless exploration.

#### Transcript

[27:59] What the where the user's taking at, I guess that kind of dictates what you could do next with it.

[28:05] And so even that is something the LOM could be suggesting.

[28:10] They clearly were describing use cases.

[28:14] So these are ways that you could use AI.

[28:19] Uh achieve some task, doing something, learning something, uh considering brainstorming, and maybe it's just more brainstorming.

[28:30] Um but then it's like depending on the path that pops out, there are some like tangible next steps.

[28:43] And so yeah, I guess maybe you are almost like, yeah, okay, so that's what I mind.

[28:51] It's like, how's this thing end?

[28:53] Like, you you can't just infinity explore until you're looking at you know, a million ways to describe the thing task.

[29:01] Well, it's like work.

[29:02] Um, there's some level of granularity beyond which you're just slicing the things of fan, it doesn't matter.

[29:10] Um there's also, I mean, when you're in a brainstorming mindset mentality, there's just like a there's a sense of done.

[29:21] Okay, that idea has been captured.

[29:26] We're either gonna keep something with it or not, or we're not gonna have to talk about it.

[29:31] Um, we're gonna be talking about it with some specific goal in mind now.

[29:39] Hey, we brainstormed the uh six types of uh team building exercises you could do.

[29:49] Here they are.

[29:51] Um you know, one to two sentence discussions of them, that's fine.

[29:58] I think you look at that and say, okay, well, write it up as the real thing.

[30:03] But you're not just gonna go write it up as the real thing as like a suggestion, like you need some sort of opt-in that that's actually what you want.

[30:11] Because now you're going from uh general to specific, narrow, narrow, but still just like thin slices you're just describing.

[30:23] Now we're gonna like expand back out because we're about to go generate a bunch of text.

[30:29] What you don't want to do is generate a bunch of text unnecessarily or at the wrong time, or a bunch of detail that's just not needed yet.

[30:53] And this is one of the things that that uh decisory, whatever it's called, the question decision tool.

[31:01] This is where it fell down because it was pretty good at asking 10 questions.

[31:07] It was pretty terrible at giving like the next output that was actually useful.

[31:12] Um because sometimes the outp the next output is like just give me a rough plan.

[31:18] Just give me some steps.

[31:20] Now granted that thing was in the world of like uh code, and so it was way too eager to just start writing code or to give snippets of code or to go hard check something, and it's like I don't need like hyper-detail architecture.

[31:35] Uh now that we've talked about this, I just need to see uh diagram that visually conveys what I might do next.

[31:44] Or okay, I see we've got three, four ideas.

[31:55] Like you generate all these ideas, you get to five, ten, fifteen of them.

[31:58] And now it's sort of like okay, go collect those at the back into a single final report.

[32:05] Like given everything I said, go profile me.

[32:09] Generate a profile of what I'm uh most likely to want to do next.

[32:14] Maybe that's even just like where it goes.

[32:17] Hey, here's a report of the things based on your interest.

[32:21] Here are the next practical steps, which you could take, which it may seem of interest to you.

[32:28] And now you're like sort of shooting off into the world of what's actually go do it.

[32:36] So we're not brainstorming, we're not generating ideas.

[32:39] We're not summarizing those ideas to keep a profile.

[32:42] Now we are taking actual small descriptors of work and building it back up the other direction.

[32:50] Okay, we decided that we're gonna use AI to build uh a small agency pipeline that detects intent on a question.

[33:00] Are we trying to make comparisons, distributions, anomaly detection?

[33:05] And so now we're gonna go scope out at system.

[33:11] And maybe at this point you just needed to go generate a prompt to go generate the real plan.

[33:19] I'm gonna go kick this thing out to codex at this point.

[33:23] Um, I guess that's for this uh brainstorming AI use kit thing.

### Final shape: grid-based selection, zoom, and progressive disclosure

Time: 33:38 - 40:47

#### Summary

The speaker converges on a grid and nested hierarchy as the core interaction model. Suggestions can be represented as cells or dots, zoomed into repeatedly, and split into finer grids to support progressive disclosure and very focused exploration.

#### Transcript

[33:29] It's a little thin is you kind of have to have in mind what is the final outcome of it.

[33:38] It's okay, so like the super just don't do anything special version, is the final outcome is a multi-turn chat log that you, the user have to keep scrolling back through to make sense of it.

[33:53] That's the do nothing, just accept the results and put them on the screen.

[34:00] The slightly better version of that is well, even in that list of 1015 suggestions, there is structure that can be had.

[34:11] We can do this grid visual, and so maybe that is the final output for it.

[34:17] Here is your grid, AI use case grid.

[34:21] We suggest you go concentrate in this cell right here.

[34:25] Here's a summary of what's in that cell and what you could do next.

[34:31] And so the result is the grid with the summary, and then the user is free to take that and uh go do whatever with it.

[34:41] Maybe they just have the idea now.

[34:45] But then there's a version where you say, clearly, in that cell is some good stuff, but also clearly, just across all of the cells, you flag eight or nine things as interesting, maybe six are in one cell, and then the other three are scattered.

[35:00] And it's like, hey, across the nine that are interesting.

[35:04] Here's the theme I'm picking up on.

[35:06] Here's the stuff you can go do immediately, and now you're almost like breaking it down into next steps.

[35:12] Almost a little bit of a holistic sense of next steps.

[35:18] Hey, given all nine of these items, here are the next steps.

[35:23] And so you've got these next steps.

[35:26] And some of those next steps really are.

[35:32] But now I'm maybe not prompting for brainstorming, I'm prompting for some specific purpose.

[35:37] Go build me a policy.

[35:42] So that's all very interesting.

[35:43] And then one other thought here is like I'm imagining this is like a web form because that's where this all started.

[35:50] You know, a little helpful thing on a website, some lead gen.

[35:55] But what would a maybe better version look like?

[35:59] Well, if it's running on your computer, maybe you've got this uh web app.

[36:07] Maybe somehow it's uh codex app thing.

[36:10] Well, now all of a sudden, you're basically spawning threads in a codex to actually go do this stuff.

[36:20] What that looked like.

[36:23] Yeah, but I didn't spawn that thread.

[36:24] I do the investigation of the code base that figures out what it might actually look like to integrate in here.

[36:30] Maybe go spawn that thread over there, which says, hey, we've got some unanswered questions now that we've reviewed your code base.

[36:39] Let's go answer those questions and really pin down the functionality here.

[36:44] So we're not brainstorming, but we're doing almost like a gap analysis as a planning pre-implementation step.

[36:57] But at the core of all of this is just a clean interface for declaring intent I guess I'll say because this grid of options is like uh low intent once you start clicking in there now we've converted low intent into uh more intent higher intent better signal uh intent when actually we're going to go in that area and you can almost imagine if you take a cell you zoom into it now I'm looking at a single grid cell again and so the very next question that comes through what's the cell into its own three by three grid now we're getting hierarchy again all right yes now we're getting higher I feel like um it's almost gonna look like a quad tree barns hut kind of thing like you subdivided rectangles and so now we're in this rectangle and we've subdivided it again we've got these questions which are points being kind of forced into a little squares we're kind of building up this small little dictionary of metadata that categorizes the suggestions and we're categorizing.

[38:47] And then it may even be that the user quickly.

[38:50] Well, yeah, I started on that giant three by three grid.

[38:54] But you know, that's old news.

[38:56] I'm interested in this three by three grid.

[38:59] And really, once I saw those, I'm interested in this three by three grid.

[39:04] So now you've narrowed it really tight.

[39:07] You could almost imagine a 3D Z index sort of stacked view.

[39:14] Look at how we you know pointed the telescope in the sky.

[39:20] We zoomed in again, zoomed in again.

[39:23] And now of a sudden you're operating with really high intent.

[39:28] Here's some really really meaningful suggestions in a very specific area.

[39:36] And some of them you could just go do right now.

[39:47] I think it's a it's it's an interesting approach.

[39:50] I'm trying to think what does this combine?

[39:52] I mean it feels tree map-ish in the sense that there's hierarchy.

[39:56] Tree maps also have this uh click to isolate kind of feature.

[40:00] I'm gonna double click and zoom in.

[40:02] It's definitely got that feel to it.

[40:20] What makes it feel familiar?

[40:23] Um it gives you the ability to represent suggestions in a much smaller space.

[40:29] So that's one of the things that Chat GPT really struggles with.

[40:33] It will never show something collapsed.

[40:35] It will always show you all of the depth.

[40:39] And so if what you really want to know is just I've got a placeholder there for a future idea related to my golf hobby.

### Possible mobile app and general organizing system for ideas and tasks

Time: 41:09 - 45:20

#### Summary

The speaker wonders if the idea could become a small iOS app and broadens it into a general organizing system for ideas, suggestions, tasks, and notes. The system would let the user keep items in small bins or drawers and return to them later with minimal friction.

#### Transcript

[41:09] And so we've summarize the thing down to a single dot sitting at the intersection of two cells, a row and column.

[41:19] And so that single dot you could click on it and uh see the text again.

[41:24] You could imagine a you've only got nine total suggestions, you can just render them all in view.

[41:31] Or you could click on uh cell.

[41:35] Yeah, to like zoom in to it.

[41:37] And now you're just looking at that cell, so you can list four or five ideas.

[41:44] This is starting to make me wonder if this is uh if you just make a quick iOS app out of this thing.

[41:51] Like everything I'm describing could probably fit on an iPhone.

[41:56] That's almost this uh use AI to divide the space of interesting things.

[42:04] It's like you're building out these little grids or spaces of places where I can work.

[42:10] There's the variables that matter in this area.

[42:29] And then it's like to extend it's giving you suggestions.

[42:34] Suggestions.

[42:37] You could almost like Storm for Later.

[42:41] It's like, yeah, there's a little grid over there.

[42:44] I know I can get over to my uh financial suggestions.

[42:49] I'm in no rush.

[42:51] It's almost like uh you know task list of sorts.

[42:55] Some of these are tasks, some of them are suggestions, some of them are ideas, some of them are tips.

[43:01] That's just sort of like uh an organizing system.

[43:06] We're gonna put ideas in their little drawers and their little bins.

[43:10] They're there for you when you want to watch them.

[43:25] Alright, so play with that idea a little bit.

[43:39] Kind of what I'm saying.

[43:53] Yeah, probably.

[43:55] And so it's like I'm always two or three clicks away from looking at a very narrow set of things to do next.

[44:04] I wonder if you could organize a task list around this idea.

[44:14] They live in a four by four grid, three by two grid.

[44:18] I'm not sure what it would take when you're messing with them on the iPhone.

[44:23] It's uh tap, tap tap.

[44:26] You've zoomed in on a specific set of tasks.

[44:29] You're looking at them.

[44:31] You zoom back out.

[44:32] You don't have to worry about them.

[44:34] Or you can go focus on something else.

[44:39] Might be an interesting uh just kind of visual component to go play with idea of uh grid of information hierarchical dot for a data point or a note or something once you zoom in close enough you start to render more of it and then you select it and it renders the whole thing.

[45:01] On the size of the content maybe what's inside there is a whole document.

[45:06] Maybe what's inside there is just a draft.

[45:10] I guess if you've got a whole document in there maybe that's fine.

[45:15] Or maybe the goal then is to break the document down into chunks.

### Transcripts, tagging, and two-dimensional views of structured text

Time: 45:22 - 50:21

#### Summary

The speaker connects the idea back to transcript organization and notes that large text can be chunked, summarized, and tagged along two dimensions. A grid of rows and columns, with hierarchy inside cells, could help render and explore transcript-like material or other large context blocks.

#### Transcript

[45:22] Well put that idea a little bit because that's what that's uh that's basically what the transcript system was trying to do.

[45:30] Like you've got this long transcript, it's got a bunch of stuff in it.

[45:34] You're sort of trying to like indicate what to do next with some of that stuff.

[45:40] I am struggling a little bit with just like how to organize and view that info.

[45:43] Like, well, I've got these tasks I could go do.

[45:48] But often they're not really tasks because I'm describing like work to be done if you're going to go build a certain system.

[45:55] It's not like I'm building that system today, it's just sort of ivy hating.

[46:00] Um yeah, what if you took a what if you took a transcript or forced to render it in two dimensions, something by something type by time.

[46:17] Uh could do, should do, must do by category.

[46:25] Something like that, maybe.

[46:27] That's interesting.

[46:29] And then you're basically giving you back in this idea of like chunking, summarizing.

[46:36] If you then have a category of stuff that you must do and it's urgent, you could imagine a view on that stuff, having the LLM give you uh exact plan for how to make that happen.

[46:52] Would that work?

[46:54] Maybe okay, but definitely in here is the idea of you can take the text that's giving you, give it just a touch of structure with some tagging.

[47:11] If you can meaningfully tag on two dimensions, you've now got the ability to render in a grid of rows and columns.

[47:21] The rows and columns could definitely have this hierarchical matrix to them where a single cell can become the focus, and then it can be split on additional rows and columns.

[47:37] And once you've done this two or three times, you arrive at a very fine view of the world.

[47:53] It's very clear what you look at.

[48:30] There's clearly a uh kind of general information architecture in here.

[48:34] There's clearly a way to do brainstorming that gets things targeted fast.

[48:40] There's clearly a good starting point for a AI use cases tool that could go be in the specific implementation.

[48:51] And then from there figure out which pieces of this would support this kind of general exploration of LLM responses and related general exploration of large bits of context that could be plausibly decomposed into findings tagged with attributes and then you're exploring the attributes in a grid view.

[49:30] And similar to pivot tables and the rest if you can show it in row column, you could easily do the kind of whole k degree treatment where rows are actually grouped by three variables and columns are grouped by two variables.

[49:50] I clearly you've just created a new set of rows and columns, but they're grouped.

[49:54] They've got some hierarchy alphabetis for it.

[49:57] So that might work.

[50:00] Okay, it feels like there's so much new stuff in there.

[50:07] Because that really was a compelling problem.

[50:11] And I suspect that would be a pretty compelling offering for an AI consultant to just have streamlined model for that sort of thing.