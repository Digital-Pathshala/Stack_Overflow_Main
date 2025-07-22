import React, { useState } from 'react';
import { Crown, MapPin, Github, Linkedin, Globe, Calendar, Edit, X, Save, Plus, ArrowLeft, User, Link, Code } from 'lucide-react';

const EditProfile = ({ profileData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...profileData });
    const [newSkill, setNewSkill] = useState('');
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        if (!formData.bio.trim()) {
            newErrors.bio = 'Bio is required';
        }

        // URL validation
        const urlFields = ['github', 'linkedin', 'website'];
        urlFields.forEach(field => {
            if (formData[field] && !isValidUrl(formData[field])) {
                newErrors[field] = 'Please enter a valid URL';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const skillColors = [
        'bg-red-100 text-red-800',
        'bg-blue-100 text-blue-800',
        'bg-green-100 text-green-800',
        'bg-yellow-100 text-yellow-800',
        'bg-purple-100 text-purple-800',
        'bg-pink-100 text-pink-800',
        'bg-indigo-100 text-indigo-800',
        'bg-orange-100 text-orange-800'
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onCancel}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                                <p className="text-gray-600">Update your profile information</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username *
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your username"
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio *
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                rows={4}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Tell us about yourself..."
                            />
                            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your location"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Link className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GitHub Profile
                            </label>
                            <input
                                type="url"
                                value={formData.github}
                                onChange={(e) => handleInputChange('github', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.github ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="https://github.com/yourusername"
                            />
                            {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                LinkedIn Profile
                            </label>
                            <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.linkedin ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="https://linkedin.com/in/yourusername"
                            />
                            {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Personal Website
                            </label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.website ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="https://yourwebsite.com"
                            />
                            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Code className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Skills & Technologies</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Skills
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a skill and press Enter"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={addSkill}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Skills ({formData.skills.length})
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${skillColors[index % skillColors.length]}`}>
                                        <span>#{skill}</span>
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            * Required fields
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onCancel}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'Adit Tamang',
        username: 'tamangadit',
        bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about building scalable applications and helping fellow developers solve complex problems.',
        location: 'San Francisco, CA',
        github: 'https://github.com/AditTamang',
        linkedin: 'https://www.linkedin.com/in/adittamang/',
        website: 'https://adittamang.com.np/',
        skills: [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'MongoDB',
            'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Redux', 'Express.js',
            'Next.js', 'Tailwind CSS', 'Jest'
        ]
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = (updatedData) => {
        setProfileData(updatedData);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const badges = [
        { name: 'Gold', color: 'bg-yellow-100 text-yellow-800', icon: '🏆' },
        { name: 'Silver', color: 'bg-gray-100 text-gray-800', icon: '🥈' },
        { name: 'Bronze', color: 'bg-orange-100 text-orange-800', icon: '🥉' },
        { name: 'Expert', color: 'bg-purple-100 text-purple-800', icon: '👑' },
        { name: 'Moderator', color: 'bg-blue-100 text-blue-800', icon: '🛡️' }
    ];

    const skills = profileData.skills.map((skill, index) => {
        const colors = [
            'bg-red-100 text-red-800',
            'bg-green-100 text-green-800',
            'bg-blue-100 text-blue-800',
            'bg-purple-100 text-purple-800',
            'bg-pink-100 text-pink-800',
            'bg-orange-100 text-orange-800'
        ];
        return { name: skill, color: colors[index % colors.length] };
    });

    if (isEditing) {
        return (
            <EditProfile
                profileData={profileData}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    {/* Profile Header */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {profileData.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <Crown className="absolute -bottom-1 -right-1 w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span>@{profileData.username}</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                                </div>
                                <p className="text-sm text-gray-500">Last seen 2 hours ago</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <button
                                onClick={handleEditClick}
                                className="mb-4 inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </button>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl font-bold text-blue-600">12,750</span>
                                <Crown className="w-5 h-5 text-yellow-500" />
                            </div>
                            <p className="text-sm text-gray-500">Reputation</p>
                        </div>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Activity & Stats</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 mb-1">145</div>
                            <div className="text-sm text-gray-600">Questions Asked</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 mb-1">387</div>
                            <div className="text-sm text-gray-600">Answers Given</div>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-lg">
                            <div className="text-2xl font-bold text-emerald-600 mb-1">2,156</div>
                            <div className="text-sm text-gray-600">Upvotes Received</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600 mb-1">23</div>
                            <div className="text-sm text-gray-600">Downvotes Received</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t">
                        <span>Member since</span>
                        <span className="font-medium">March 15, 2020</span>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Badges</h3>
                        <span className="text-sm text-gray-500">(5)</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {badges.map((badge, index) => (
                            <div key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color} flex items-center gap-1`}>
                                <span>{badge.icon}</span>
                                <span>{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About and Skills - Horizontal Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* About Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                        <p className="text-gray-600 mb-6">
                            {profileData.bio}
                        </p>

                        <div className="space-y-3">
                            {profileData.location && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{profileData.location}</span>
                                </div>
                            )}
                            {profileData.github && (
                                <a
                                    href={profileData.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                >
                                    <Github className="w-4 h-4" />
                                    <span className="cursor-pointer">GitHub</span>
                                </a>
                            )}
                            {profileData.linkedin && (
                                <a
                                    href={profileData.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                >
                                    <Linkedin className="w-4 h-4" />
                                    <span className="cursor-pointer">LinkedIn</span>
                                </a>
                            )}
                            {profileData.website && (
                                <a
                                    href={profileData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-green-600 hover:text-green-800"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span className="cursor-pointer">Website</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg font-semibold text-gray-900">Skills & Technologies</span>
                            <span className="text-sm text-gray-500">({profileData.skills.length})</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${skill.color}`}>
                                    #{skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;