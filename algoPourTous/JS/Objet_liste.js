function Liste_animee(liste_init, x0, y0, dx, dy, orientation, h, w, couleurF, couleurT, id_canvas){
	
	this.liste = liste_init;
	//coordonnees initiales
	this.x0 = x0;
	this.y0 = y0;
	//tailles où on peut écrire
	this.dx = dx;
	this.dy = dy;
	this.orientation = orientation;
	//taillle de cases (height, wigth)
	this.h = h;
	this.w = w;
	this.pinceau = document.getElementById(id_canvas).getContext("2d");

	this.couleurF = couleurF//Couleu de fond
	this.couleurT = couleurT//couleur du texte

	this.animationEnCours = false;
	this.delta_init = 5;

	this.delta = function(N,decalage){
		rep = this.delta_init;
		if(this.orientation == "vertical"){
			//on reduit le delta tant qu'on manque de place pour afficher N elements de la liste
			while(this.h + (N-1)*(this.h+rep) > this.dy-decalage-this.h/2 && rep >= -this.h+this.delta_init){
				rep = rep - 1;
			}
			return rep;
		}
		else{
			//on reduit le delta tant qu'on manque de place pour afficher N elements de la liste
			while(this.w + (N-1)*(this.w+rep) > this.dx-decalage-this.w/2 && rep >= -this.w+this.delta_init){
				rep = rep - 1;
			}
			return rep;
		}
	}

	this.nettoyer = function(){
		this.pinceau.beginPath();
		this.pinceau.fillStyle = "white";

		this.pinceau.rect(this.x0-2, this.y0-2, this.dx+4, this.dy+4);
		this.pinceau.fill();
	}

	this.tracer_element = function(txt, x, y){

		this.pinceau.beginPath();
		this.pinceau.lineWidth = 1;
		this.pinceau.strokeStyle = "black";
		this.pinceau.fillStyle = this.couleurF;
		this.pinceau.rect(x, y, this.w, this.h);
		this.pinceau.fill();	
		this.pinceau.stroke();


		this.pinceau.fillStyle = this.couleurT;
		//On recherche la bonne police
		var police = 20;
		this.pinceau.font = police+'pt Calibri';
				
		while(this.pinceau.measureText(txt).width > w-2 || parseInt(this.pinceau.font) > h-2){//tant que le texte ne rentre pas
			police = police-1;
			this.pinceau.font = police+'pt Calibri';
		}

		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'middle';
			
		this.pinceau.fillText(txt, x+w/2, y+h/2);

	}

	this.tracer_cadre = function(){
		this.pinceau.beginPath();
		this.pinceau.lineWidth = 3;
		this.pinceau.strokeStyle = "red";
		if(this.orientation == "vertical"){
			this.pinceau.strokeRect(this.x0, this.y0+this.dy-this.h, this.w, this.h);	
		}
		else{
			this.pinceau.strokeRect(this.x0+this.dx-this.w, this.y0, this.w, this.h);	
		}
		

	}

	this.tracer_liste = function(delta1,N,nettoyer,decalage){
		if(nettoyer){
			this.nettoyer();
		}

		if(this.orientation == "vertical" && N>0){
			//L'ecart entre les bloques est donne par this.delta(N)
			var delta = Math.min(delta1,this.delta(N,decalage));

			//Si y en a vraiment trop d'elements, on supprime les derniers
			while(this.h + (N-1)*(this.h+delta) > this.dy-decalage-this.h/2){
				N = N-1;
			}

			var y = this.y0 + this.dy - decalage - this.h - (N-1)*(this.h+delta);//coordonnee du premier element (celui tout en haut)

			//On les trace de haut en bas
			for(var i = N-1 ; i>0 ; i--){
				this.tracer_element(this.liste[i][0], this.x0, y);
				y = y + this.h + delta;
			}
			//celui tout en bas lui reste fixe
			this.tracer_element(this.liste[0][0], this.x0, this.y0+this.dy-decalage-this.h);


		}
		else if(N>0){
			//L'ecart entre les bloques est donne par this.delta(N)
			var delta = Math.min(delta1,this.delta(N,decalage));

			//Si y en a vraiment trop d'elements, on supprime les derniers
			while(this.w + (N-1)*(this.w+delta) > this.dx-decalage-this.w/2){
				N = N-1;
			}

			var x = this.x0 + this.dx - decalage - this.w - (N-1)*(this.w+delta);//coordonnee du premier element (celui tout en haut)

			//On les trace de haut en bas
			for(var i = N-1 ; i>0 ; i--){
				this.tracer_element(this.liste[i][0], x, this.y0);
				x = x + this.w + delta;
			}
			//celui tout en bas lui reste fixe
			this.tracer_element(this.liste[0][i], this.x0+this.dx-decalage-this.w, this.y0);
		}

		this.tracer_cadre();
	}

	this.get_coordonnes = function(){
		var coordonnees = [];
		var N = this.liste.length;
		for(var i = 0 ; i < N ; i++){
			coordonnees.push([0,0]);
		}
		
		if(this.orientation == "vertical" && N>0){
			//L'ecart entre les bloques est donne par this.delta(N)
			var delta = this.delta(N,0);

			//Si y en a vraiment trop d'elements, on supprime les derniers
			while(this.h + (N-1)*(this.h+delta) > this.dy-this.h/2){
				N = N-1;
			}

			var y = this.y0 + this.dy - this.h - (N-1)*(this.h+delta);//coordonnee du premier element (celui tout en haut)

			//On les trace de haut en bas
			for(var i = N-1 ; i>0 ; i--){
				coordonnees[i][0] = this.x0;
				coordonnees[i][1] = y;

				y = y + this.h + delta;
			}
			//celui tout en bas lui reste fixe
			coordonnees[0][0] = this.x0;
			coordonnees[0][1] = this.y0+this.dy-this.h;


		}
		else if(N>0){
			//L'ecart entre les bloques est donne par this.delta(N)
			var delta = this.delta(N,0);

			//Si y en a vraiment trop d'elements, on supprime les derniers
			while(this.w + (N-1)*(this.w+delta) > this.dx-this.w/2){
				N = N-1;
			}

			var x = this.x0 + this.dx - this.w - (N-1)*(this.w+delta);//coordonnee du premier element (celui tout à gauche)

			//On les trace de haut en bas
			for(var i = N-1 ; i>0 ; i--){
				coordonnees[i][0] = x;
				coordonnees[i][1] = this.y0;

				x = x + this.w + delta;
			}
			//celui tout à droite lui reste fixe
			coordonnees[0][0] = this.x0+this.dx-this.w;
			coordonnees[0][1] = this.y0;
		}

		return coordonnees;
	}

	this.tracer = function(){
		var N = this.liste.length;
		this.tracer_liste(this.delta(N),N,true,0);
	}

	this.ajouter = function(txt, animation,affichage){
		this.animationEnCours = false;
		this.liste.push(txt);
		var N = this.liste.length;
		if(animation && affichage){
			var delta1 = this.delta(N-1,0);
			var delta2 = this.delta(N,0);

			if(this.orientation == "vertical"){
				while(this.h + (N-1)*(this.h+delta2) > this.dy-this.h/2){
					N = N-1;
				}
			}
			else{
				while(this.w + (N-1)*(this.w+delta2) > this.dx-this.w/2){
					N = N-1;
				}
			}
			
			var obj = this;
			setTimeout(function(){
				obj.animationEnCours = true;
				obj.animation_ajout(delta1,delta2,N,20);}
				,50);

		}
		else if(affichage){
			this.tracer_liste(this.delta(N),N,true,0);
		}
	}

	this.animation_ajout = function(d1,d2,N2,iteration){
		var N = this.liste.length;

		if(this.animationEnCours && iteration>0){
			
			this.nettoyer();
			//On trace le nouveau bloque
			if(this.orientation == "vertical"){

				var y_fin = this.y0 + this.dy - this.h - (N2-1)*(this.h+d2);
				var y = this.y0 + (y_fin-this.y0)/20*(20-iteration);
				this.tracer_element(this.liste[N-1][0],this.x0,y);
			}
			else{

				var x_fin = this.x0 + this.dx - this.w - (N2-1)*(this.w+d2);
				var x = this.x0 + (x_fin-this.x0)/iteration;
				this.tracer_element(this.liste[N-1][0],x,this.y0);
			}

			this.tracer_liste(d1,N2-1,false,0);//On trace les bloques deja existans en forcant leur ecart à d1 (qui est inferieur ou egale a ce qu'il devrait etre)
			
			var obj = this;
			if(d1>d2){
				setTimeout(function(){obj.animation_ajout(d1-(d1-d2)/iteration,d2,N2,iteration-1);},50);
			}
			else{
				setTimeout(function(){obj.animation_ajout(d1,d2,N2,iteration-1);},50);
			}
				
		}
		else{
			this.tracer_liste(d2,N,true,0);
		}
	}


	this.recuperer = function(animation,affichage){
		this.animationEnCours = false;
		var N = this.liste.length;
		if(animation && affichage && N>=1){
			var obj = this;
			rep = this.liste[0];
			this.liste.splice(0,1);
			setTimeout(function(){
				obj.animationEnCours = true;
				obj.animation_recuperer(20);}
				,50);
			return rep;
		}
		else{
			reponse = this.liste[0];
			this.liste.splice(0,1);
			if(affichage){
				this.tracer_liste(this.delta(N),N-1,true,0);
			}
			return reponse;
		}
	}

	this.animation_recuperer = function(iteration){
		N = this.liste.length;
		if(this.animationEnCours && iteration>0){

			if(this.orientation == "vertical"){
				this.tracer_liste(this.delta(N),N,true,this.w*iteration/20);
			}
			else{
				this.tracer_liste(this.delta(N),N,true,this.h*iteration/20);
			}
			
			var obj = this;

			setTimeout(function(){
				obj.animation_recuperer(iteration-1);}
				,50);
		}
		else{
			this.tracer_liste(this.delta(N),N,true,0);
		}
	}

	this.comparer = function(A,B){
		return A[0]>B[0];
	}

	this.trier_liste = function(){
		var fini  = false;
		var N = this.liste.length;
		var modifications = [];
		for(var j = 0 ; j < N ; j++){
			modifications.push(j);
		}

		while(!fini){
			fini = true;
			for(var i = 0 ; i<N-1 ; i++){
				if(this.comparer(this.liste[i] , this.liste[i+1])){
					fini = false;
					//modification de la liste
					var tampon = this.liste[i].slice();
					this.liste[i] = this.liste[i+1].slice();
					this.liste[i+1] = tampon;

					//memoristion de l'echange effectué
					var tampon = modifications[i];
					modifications[i] = modifications[i+1];
					modifications[i+1] = tampon;
				}
			}
		}

		return modifications;
	}

	this.trier = function(animation,affichage){
		this.animationEnCours = false;
		if(affichage && animation){
			var coordonnees_fin = this.get_coordonnes();
			var N = this.liste.length;

			var modifications = this.trier_liste();
			var coordonnees_debut = [];

			for(var i = 0 ; i < N ; i++){
				coordonnees_debut[i] = coordonnees_fin[modifications[i]];
			}


			var obj = this;
			setTimeout(function(){
				obj.animationEnCours = true;
				obj.animation_trier(20, coordonnees_debut, coordonnees_fin);}
				,50);

		}

		else{
			this.trier_liste();
			if(affichage){
				this.tracer();
			}
		}



	}

	this.animation_trier = function(iteration, coordonnees_debut, coordonnees_fin){
		if(this.animationEnCours && iteration>0){
			this.nettoyer();
			var N = this.liste.length;

			for(var i = N-1 ; i >=0 ; i--){
				if(iteration>=10){
					if(this.orientation == "vertical"){
						var y = coordonnees_fin[i][1] - iteration*(coordonnees_fin[i][1] - coordonnees_debut[i][1] )/20;
						//var y = coordonnees_debut[modifications_inverse[i]][1] - (iteration-20)*(this.y0+this.dy-this.h - coordonnees_debut[modifications_inverse[i]][1])/10;
						var x = this.x0;
					}
					else{
						var x = coordonnees_fin[i][0] - iteration*(coordonnees_fin[i][0] - coordonnees_debut[i][0] )/20;
						//var x = coordonnees_debut[modifications_inverse[i]][0] - (iteration-20)*(this.x0+this.dx-this.w - coordonnees_debut[modifications_inverse[i]][0])/10;
						var y = this.y0;
					}
					this.tracer_element(this.liste[i][0] , x , y);
				}
				else{
					if(this.orientation == "vertical"){
						var y = coordonnees_fin[i][1] - iteration*(coordonnees_fin[i][1] - coordonnees_debut[i][1] )/20;
						//var y = coordonnees_fin[i][1] + (iteration-1)*(this.y0+this.dy-this.h - coordonnees_fin[i][1])/10;
						var x = coordonnees_fin[i][0];//
					}
					else{
						//var x = coordonnees_fin[i][0] + (iteration-1)*(this.x0+this.dx-this.w - coordonnees_fin[i][0])/10;
						var x = coordonnees_fin[i][0] - iteration*(coordonnees_fin[i][0] - coordonnees_debut[i][0] )/20;
						var y = coordonnees_fin[i][1];
					}
					this.tracer_element(this.liste[i][0] , x , y);
				}
				
			}
			this.tracer_cadre();

			var obj = this;

			setTimeout(function(){
				obj.animation_trier(iteration-1 , coordonnees_debut , coordonnees_fin);}
				,50);
		}

		else{
			this.tracer();
		}
	}

}
