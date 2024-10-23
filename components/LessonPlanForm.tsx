'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle,  } from "./ui/card";
import React from 'react'
import { useRouter } from "next/navigation";
import { useToast } from "../hooks/use-toast";
import { durations, studentLevels, subtopics, topics } from "../constants"
import { containerVariants, itemVariants } from "../lib/animation";
import {
    BookOpen,
    Clock,
    Target,
    BookmarkIcon,
    Sparkles,
    GraduationCap,
    Loader2,
    X,
} from "lucide-react";
import { CreateLessonPlan } from "@/app/create/actions";

const LessonPlanForm = ({ isSubscribed } : { isSubscribed: boolean }) => {
    const [ step, setStep ] = useState(1);
    const [ formData, setFormData ] = useState({
        topic: "",
        subtopic: "",
        duration: "",
        studentLevel: "",
        objective: "",
    });
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ customTopic, setCustomTopic ] = useState<string>("");
    const [ customSubtopic, setCustomSubtopic ] = useState<string>("");

    const { toast } = useToast();

    const router = useRouter();


    const handleNext = () => {
        if(isStepValid(step)) {
            setStep(step + 1);
        }
    }

    const handlePrev = () => {
        setStep(step - 1);
    }

    const isStepValid = (currentStep: number) => {
        switch (currentStep) {
            case 1:
                return isSubscribed ? customTopic !== "" : formData.topic !== "";
            case 2: 
                return isSubscribed 
                    ? (customSubtopic !== '' && customTopic !== '') || (formData.subtopic !== '' && formData.topic !== '')
                    : formData.subtopic !== '';
            case 3:
                return formData.duration !== '';
            case 4:
                return formData.studentLevel !== '';
            case 5:
                return formData.objective !== '';
            default:
                return false;
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if(field === "topic") {
            setCustomTopic('');
            setFormData({
                ...formData,
                topic: value,
                subtopic: "",
            })
        } else if (field === "subtopic") {
            setCustomSubtopic('');
            setFormData({
                ...formData,
                subtopic: value
            })
        } else {
            setFormData({
                ...formData,
                [field]: value
            })
        }
    }

    const handleCustomTopicChange = (value: string) => {
        setCustomTopic(value);
        setFormData({
            ...formData,
            topic: '',
            subtopic: '',
        });
        setCustomSubtopic('');
    };

    const handleCustomSubtopicChange = (value: string) => {
        setCustomSubtopic(value);
        setFormData({
            ...formData,
            subtopic: '',
        });
    }

    const clearTopic = () => {
        setCustomTopic('');
        setCustomSubtopic('');
        setFormData({
            ...formData,
            topic: '',
            subtopic: '',
        });
    }

    const clearSubtopic = () => {
        setCustomSubtopic('');
        setFormData({
            ...formData,
            subtopic: '',
        });
    }

    const isFormComplete = () => {
        const { topic, subtopic, duration, studentLevel, objective } = formData;

        let result;

        if(isSubscribed) {
            result = 
                ((customTopic !== '' && customSubtopic !== '') || (topic !== '' && subtopic !== '')) &&
                duration !== '' &&
                studentLevel !== '' &&
                objective !== '';
        } else {
            result = 
                topic !== '' &&
                subtopic !== '' &&
                duration !== '' &&
                studentLevel !== '' &&
                objective !== '';
        }

        return result;
    }

    useEffect(() => {
        if(formData.topic && subtopics[formData.topic as keyof typeof subtopics]) {
            setFormData((prev) => ({
                ...prev,
                subtopic: '',
            }))
        }
    }, [formData.topic])

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        key={"step1"}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                    >
                        <motion.div className="flex items-center mb-4" variants={itemVariants}>
                            <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
                            <h2 className="text-2xl font-bold">Select Topic</h2>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            {isSubscribed && (
                                <div className="space-y-4 mb-4">
                                    <Input
                                        placeholder="Enter custom topic"
                                        value={customTopic}
                                        onChange={(e) => handleCustomTopicChange(e.target.value)}
                                        className="w-full"
                                        disabled={formData.topic !== ""}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Or choose from predefined topics
                                    </p>
                                </div>
                            )}
                            {
                                <div className="flex items-center space-x-2">
                                    <Select
                                        onValueChange={(value) => handleInputChange("topic", value)}
                                        name="topic"
                                        value={formData.topic}
                                    >
                                        <SelectTrigger
                                            className="w-full"
                                            disabled={customSubtopic !== ""}
                                        >
                                            <SelectValue placeholder="choose a topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {topics.map((topic) => (
                                            <SelectItem key={topic} value={topic}>
                                            {topic}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    {isSubscribed && formData.topic && (
                                        <Button onClick={clearTopic} variant={"outline"} size={"icon"}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            }
                        </motion.div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key={"step2"}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                    >
                        <motion.div className="flex items-center mb-4" variants={itemVariants}>
                            <BookmarkIcon className="w-6 h-6 mr-2 text-indigo-500" />
                            <h2 className="text-2xl font-bold">Select Subtopic</h2>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            {isSubscribed && customTopic !== "" && (
                                <div className="space-y-4 mb-4">
                                    <Input
                                        placeholder="Enter custom subtopic"
                                        value={customSubtopic}
                                        onChange={(e) => handleCustomSubtopicChange(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            )}
                            {(isSubscribed && customTopic === "") || !isSubscribed ? (
                                <div className="flex items-center space-x-2">
                                    <Select
                                        onValueChange={(value) =>
                                        handleInputChange("subtopic", value)
                                        }
                                        value={formData.subtopic}
                                        name="subtopic"
                                    >
                                        <SelectTrigger>
                                        <SelectValue placeholder="choose a subtopic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {subtopics[formData.topic as keyof typeof subtopics]?.map(
                                            (subtopic) => (
                                            <SelectItem key={subtopic} value={subtopic}>
                                                {subtopic}
                                            </SelectItem>
                                            )
                                        )}
                                        </SelectContent>
                                    </Select>
                                    {isSubscribed && formData.subtopic && (
                                        <Button
                                            onClick={clearSubtopic}
                                            variant="outline"
                                            size="icon"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ) : null}
                        </motion.div>
                    </motion.div>
                )
            case 3:
                return (
                    <motion.div
                      key={"step3"}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                    >
                        <motion.div className="flex items-center mb-4" variants={itemVariants}>
                            <Clock className="w-6 h-6 mr-2 text-green-500" />
                            <h2 className="text-2xl font-bold">Select Duration</h2>
                        </motion.div>
                        <motion.div>
                                <Select
                                    name="duration"
                                    onValueChange={(value) => handleInputChange("duration", value)}
                                    value={formData.duration}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="choose a duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {durations.map((duration) => (
                                        <SelectItem key={duration} value={duration}>
                                            {duration}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                        </motion.div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        key={"step4"}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                    >
                        <motion.div className="flex items-center mb-4" variants={itemVariants}>
                          <GraduationCap className="w-6 h-6 mr-2 text-blue-500" />
                          <h2 className="text-2xl font-bold">Select Student level</h2>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Select
                                name="studentLevel"
                                onValueChange={(value) =>
                                    handleInputChange("studentLevel", value)
                                }
                                value={formData.studentLevel}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="choose the students level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {studentLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </motion.div>
                    </motion.div>
                );
            case 5:
                return (
                        <motion.div
                            key={"step5"}
                            initial="hidden"
                            animate="visible"
                            exit={"exit"}
                            variants={containerVariants}
                        >
                            <motion.div className="flex items-center mb-4" variants={itemVariants}>
                                <Target className="w-6 h-6 mr-2 text-purple-500" />
                                <h2 className="text-2xl font-bold">Enter lesson objective</h2>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Input
                                    placeholder="Enter the lesson objective (max 100 characters)"
                                    max={100}
                                    value={formData.objective}
                                    onChange={(e) => handleInputChange("objective", e.target.value)}
                                    className="w-full"
                                    name="objective"
                                />
                            </motion.div>
                        </motion.div>
                );
            default:
                return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSubmit = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            formDataToSubmit.append(key, value);
        });

        if(isSubscribed) {
            if (customTopic) formDataToSubmit.set("topic", customTopic);
            if (customSubtopic) formDataToSubmit.set("subtopic", customSubtopic);
        }

        try {
            const res = await CreateLessonPlan(formDataToSubmit);
            if(res.success) {
                router.push('/dashboard');
            } else {
                toast({
                    title: "Error",
                    description: 'An error occurred. Please try again.',
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: 'An error occurred. Please try again.' + (error as Error).message,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false);
        }
    };

    const renderLoadingAnimation = () => {
        return (
            <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white rounded-lg p-8 flex flex-col items-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <motion.div
                        animate={{
                        rotate: 360,
                        transition: { duration: 2, repeat: Infinity, ease: "linear" },
                        }}
                    >
                        <Loader2 className="w-16 h-16 text-indigo-600" />
                    </motion.div>
                    <motion.h2
                        className="mt-4 text-2xl font-bold text-gray-800"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        Crafting your lesson plan
                    </motion.h2>
                    <motion.p
                        className="mt-2 text-gray-600 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        Our AI is working its magic to create the perfect lesson plan for
                        you!
                    </motion.p>
                    <motion.div
                        className="mt-6 w-48 h-2 bg-gray-200 rounded-full overflow-hidden"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: 3,
                            ease: "easeInOut",
                        }}
                    >
                        <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        );
      };

      return (
        <Card className="relative overflow-hidden">
            <form onSubmit={handleSubmit}>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-gray-800">
                        Lesson Planner
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex justify-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full mx-1 ${ i <= step ? "bg-indigo-500" : "bg-gray-300"}`}
                        />
                        ))}
                    </div>
                    <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
                    <motion.div
                        className="mt-6 flex justify-between"
                        initial="hidden"
                        animate="visible"
                    >
                        {step > 1 && (
                            <motion.div>
                                <Button onClick={handlePrev} variant={"outline"}>
                                    Previous
                                </Button>
                            </motion.div>
                        )}
                        {step < 5 ? (
                            <Button
                                onClick={handleNext}
                                disabled={!isStepValid(step)}
                                className={buttonVariants({
                                    variant: "default",
                                    className: "ml-auto",
                                })}
                                type="button"
                            >
                                Next
                            </Button>
                        ) : (
                            <motion.div className="ml-auto">
                                <Button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    disabled={!isFormComplete() || isLoading}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Lesson Plan
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </CardContent>
                <AnimatePresence>
                    {isLoading && renderLoadingAnimation()}
                </AnimatePresence>
            </form>
        </Card>
      )
}

export default LessonPlanForm