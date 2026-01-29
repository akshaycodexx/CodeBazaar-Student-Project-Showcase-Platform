const Interview = require("../models/Interview");
const User = require("../models/User");

// Problem Bank
const PROBLEMS = {
    DSA: [
        { title: "Two Sum", description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}" },
        { title: "Reverse String", description: "Write a function that reverses a string. The input string is given as an array of characters.", starterCode: "function reverseString(s) {\n  // Write your code here\n}" },
        { title: "Valid Palindrome", description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", starterCode: "function isPalindrome(s) {\n  // Write your code here\n}" }
    ],
    Frontend: [
        { title: "Counter Component", description: "Create a React Counter component that increments/decrements on button click.", starterCode: "import React, { useState } from 'react';\n\nexport default function Counter() {\n  // Write your code here\n}" },
        { title: "Fetch Data", description: "Write a function to fetch data from https://api.example.com/data and return the JSON response.", starterCode: "async function getData() {\n  // Write your code here\n}" }
    ]
};

// Schedule Interview
exports.scheduleInterview = async (req, res) => {
    try {
        const { mentorId, date, topic } = req.body;

        // Pick random problem based on topic or default to DSA
        const topicProblems = PROBLEMS[topic] || PROBLEMS["DSA"];
        const randomProblem = topicProblems[Math.floor(Math.random() * topicProblems.length)];

        // If mentorId is not provided, assume Self-Practice (User is both Student and Mentor)
        // Or assign a system bot ID? Let's use user ID for now to allow "Solo Practice"
        const finalMentorId = mentorId || req.user.id;

        const interview = new Interview({
            mentor: finalMentorId,
            student: req.user.id,
            date: date || new Date(), // Default to now if not provided
            topic,
            problem: randomProblem
        });

        await interview.save();
        res.status(201).json(interview);
    } catch (error) {
        console.error("Schedule error:", error);
        res.status(500).json({ message: "Scheduling failed" });
    }
};

// Get My Interviews (Both as Mentor and Student)
exports.getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            $or: [{ student: req.user.id }, { mentor: req.user.id }]
        })
            .populate("mentor", "fullName profilePicture")
            .populate("student", "fullName profilePicture")
            .sort({ date: 1 });

        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};

// Get Interview Room Details
exports.getInterviewDetails = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate("mentor", "fullName")
            .populate("student", "fullName");

        if (!interview) return res.status(404).json({ message: "Interview not found" });

        // Security check: only participants can view
        if (interview.student._id.toString() !== req.user.id && interview.mentor._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.json(interview);
    } catch (error) {
        res.status(500).json({ message: "Error loading room" });
    }
};
