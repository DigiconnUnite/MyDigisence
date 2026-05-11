"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, MessageSquare, ThumbsUp, Filter, ArrowLeft, Reply,
  MoreHorizontal, TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  project: string;
  date: string;
  likes: number;
  hasReply?: boolean;
  reply?: string;
}

interface ReviewsViewProps {
  reviews?: Review[];
  isLoading?: boolean;
}

const defaultReviews: Review[] = [
  { id: "1", name: "Rahul Sharma", rating: 5, comment: "Excellent work! Shivam delivered the project on time and exceeded our expectations. The code quality was outstanding.", project: "E-Commerce Platform", date: "2024-05-15", likes: 12 },
  { id: "2", name: "Priya Patel", rating: 5, comment: "Very professional and skilled developer. Communication was great throughout the project.", project: "Mobile App", date: "2024-05-10", likes: 8 },
  { id: "3", name: "Amit Kumar", rating: 4, comment: "Good work overall. Minor revisions were needed but they were handled promptly.", project: "Website Redesign", date: "2024-05-05", likes: 5 },
  { id: "4", name: "Sneha Gupta", rating: 5, comment: "Amazing experience working with Shivam. Highly recommend for any web development project!", project: "SaaS Dashboard", date: "2024-04-28", likes: 15, hasReply: true, reply: "Thank you Sneha! It was a pleasure working with you." },
  { id: "5", name: "Vikram Singh", rating: 4, comment: "Solid technical skills and great problem-solving abilities.", project: "API Development", date: "2024-04-20", likes: 3 },
];

export default function ReviewsView({ reviews, isLoading = false }: ReviewsViewProps) {
  const [filter, setFilter] = useState<"all" | 5 | 4 | 3 | 2 | 1>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");

  const data = reviews || defaultReviews;

  const filteredReviews = data.filter(r => filter === "all" || r.rating === filter);

  const averageRating = data.reduce((acc, r) => acc + r.rating, 0) / data.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: data.filter(r => r.rating === stars).length,
    percentage: Math.round((data.filter(r => r.rating === stars).length / data.length) * 100)
  }));

  const handleReply = () => {
    setReplyText("");
    setSelectedReview(null);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and respond to client reviews</p>
      </div>

      {/* Rating Overview */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-xl text-gray-500">/5</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={cn(
                    "h-5 w-5",
                    star <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  )} 
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">{data.length} reviews</p>
          </div>

          {/* Rating Bars */}
          <div className="flex-1 space-y-2">
            {ratingCounts.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{r.stars}★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Reviews
        </Button>
        {[5, 4, 3, 2, 1].map((stars) => (
          <Button 
            key={stars}
            variant={filter === stars ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter(stars as 5 | 4 | 3 | 2 | 1)}
          >
            {stars} <Star className="h-3 w-3 ml-1 fill-current" />
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {review.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={cn(
                              "h-4 w-4",
                              star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">• {review.date}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedReview(review)}>
                        <Reply className="h-4 w-4 mr-2" /> Reply
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge variant="outline" className="mt-3 mb-2">
                  {review.project}
                </Badge>

                <p className="text-gray-600 mt-2">{review.comment}</p>

                {review.hasReply && review.reply && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <p className="text-sm text-gray-500 mb-1">Your reply:</p>
                    <p className="text-gray-700">{review.reply}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {review.likes} likes
                  </Button>
                  {!review.hasReply && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedReview(review)}>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reply Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">"{selectedReview?.comment}"</p>
              <p className="text-sm text-gray-500 mt-2">— {selectedReview?.name}</p>
            </div>
            <Textarea
              placeholder="Write your response..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedReview(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleReply} disabled={!replyText.trim()}>
                Post Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
