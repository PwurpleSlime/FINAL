//
//  MeetinPlaceCard.swift
//  Final-Front-End-IOS
//
//  Created by Student on 5/13/25.
//

import SwiftUI

struct MeetinPlaceCard: View {
    let place: MeetingPlace
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(place.host)
                .font(.headline)
            Text(place.address)
                .font(.subheadline)
            Text("Starts: \(place.timeStart) on \(place.dateStart)")
                .font(.footnote)
            if let end = place.timeEnd, !end.isEmpty {
                Text("Ends: \(end)")
                    .font(.footnote)
            }
        }
        .padding()
        .background(Color.blue.opacity(0.1))
        .cornerRadius(10)
    }
}

#Preview {
    MeetinPlaceCard(place: MeetingPlace(host: "John Skyrim", address: "310 S Main Street", timeStart: "3:10am", timeEnd: "3:30am", dateStart: "May 4th"))
}
